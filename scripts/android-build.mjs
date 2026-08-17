#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

function resolveJavaHome() {
  if (process.env.JAVA_HOME) return process.env.JAVA_HOME;
  const brew21 = '/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home';
  if (existsSync(brew21)) return brew21;
  for (const version of ['21', '25', '17']) {
    const result = spawnSync('/usr/libexec/java_home', ['-v', version], { encoding: 'utf8' });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
  }
  return '';
}

const javaHome = resolveJavaHome();
const env = {
  ...process.env,
  ANDROID_HOME: process.env.ANDROID_HOME || `${process.env.HOME}/Library/Android/sdk`,
};
if (javaHome) env.JAVA_HOME = javaHome;
env.PATH = `${env.JAVA_HOME ? `${env.JAVA_HOME}/bin:` : ''}${env.ANDROID_HOME}/platform-tools:${env.PATH}`;
if (!existsSync('android')) {
  console.error('android/ project missing. Run npx cap add android after npm run build.');
  process.exit(1);
}
const result = spawnSync('./gradlew', ['assembleDebug'], { cwd: 'android', stdio: 'inherit', env });
process.exit(result.status ?? 1);
