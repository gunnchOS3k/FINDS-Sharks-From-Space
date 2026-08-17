#!/usr/bin/env node
/** Pixel 6a production acceptance helpers (no serial persisted). */
import { spawnSync } from 'node:child_process';

const PKG = 'com.gunnchos.finds';

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  if (result.status !== 0) {
    console.error(result.stdout, result.stderr);
    process.exit(result.status ?? 1);
  }
  return result.stdout.trim();
}

function adb(args) {
  return run('adb', ['-d', ...args]);
}

const devices = run('adb', ['devices', '-l']);
if (!/device /.test(devices)) {
  console.error('No authorized Android device.');
  process.exit(1);
}

console.log('Clearing FINDS-specific adb reverse rules…');
try {
  run('adb', ['-d', 'reverse', '--list']);
} catch {
  /* no reverse rules */
}
spawnSync('adb', ['-d', 'reverse', '--remove-all'], { stdio: 'inherit' });

console.log('Force-stop and launch FINDS…');
adb(['shell', 'am', 'force-stop', PKG]);
adb(['shell', 'am', 'start', '-n', `${PKG}/.MainActivity`]);
const pid = adb(['shell', 'pidof', PKG]);
if (!pid) {
  console.error('FINDS did not start');
  process.exit(1);
}
console.log('FINDS running (pid not logged).');

console.log('Checking logcat for FATAL…');
const log = adb(['logcat', '-d', '-t', '200']);
const fatals = log.split('\n').filter((l) => /FATAL EXCEPTION|AndroidRuntime.*FATAL/.test(l) && l.includes(PKG));
if (fatals.length) {
  console.error('FATAL log lines detected');
  process.exit(1);
}
console.log('No recent FATAL for FINDS package.');
console.log('Manual: confirm map pinch/spread and shake on device.');
