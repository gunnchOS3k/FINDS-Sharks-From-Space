#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

function run(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(result.stdout, result.stderr);
    process.exit(result.status ?? 1);
  }
  return result.stdout.trim();
}

const devices = run('adb', ['devices', '-l']);
if (!/Pixel_6a|bluejay/.test(devices) && !/device /.test(devices)) {
  console.error('No authorized Pixel 6a found.');
  process.exit(1);
}
run('adb', ['-d', 'shell', 'am', 'force-stop', 'com.gunnchos.finds']);
run('adb', ['-d', 'shell', 'am', 'start', '-n', 'com.gunnchos.finds/.MainActivity']);
const pid = run('adb', ['-d', 'shell', 'pidof', 'com.gunnchos.finds']);
if (!pid) {
  console.error('FINDS process did not start');
  process.exit(1);
}
console.log('FINDS running pid hidden; smoke launch ok');
