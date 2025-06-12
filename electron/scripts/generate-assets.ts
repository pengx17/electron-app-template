import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'fs-extra';

const ROOT = path.resolve(__dirname, '..', '..');
const ELECTRON_DIR = path.resolve(ROOT, 'electron');

spawnSync('yarn', ['workspace', 'renderer', 'build'], {
  stdio: 'inherit',
  env: process.env,
  cwd: ROOT,
  shell: true,
});

// copy renderer/dist to electron/dist
fs.copySync(
  path.resolve(ROOT, 'renderer', 'dist'),
  path.resolve(ELECTRON_DIR, 'resources', 'web-static')
);

spawnSync('yarn', ['build'], {
  stdio: 'inherit',
  env: process.env,
  cwd: ELECTRON_DIR,
  shell: true,
});
