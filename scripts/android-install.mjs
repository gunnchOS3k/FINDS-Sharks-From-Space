#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const apkDir = 'android/app/build/outputs/apk/debug';
if (!existsSync(apkDir)) {
  console.error('No debug APK. Run npm run android:build first.');
  process.exit(1);
}
const apk = readdirSync(apkDir).find((name) => name.endsWith('.apk'));
if (!apk) process.exit(1);
const result = spawnSync('adb', ['-d', 'install', '-r', join(apkDir, apk)], { stdio: 'inherit' });
process.exit(result.status ?? 1);
