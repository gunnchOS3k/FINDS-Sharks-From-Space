#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
spawnSync('adb', ['-d', 'shell', 'am', 'start', '-n', 'com.gunnchos.finds/.MainActivity'], { stdio: 'inherit' });
