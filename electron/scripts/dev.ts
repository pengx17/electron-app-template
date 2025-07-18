import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

import type { BuildContext } from 'esbuild';
import * as esbuild from 'esbuild';
import kill from 'tree-kill';
import { debounce } from 'lodash-es';

import { config, electronDir } from './common';

// this means we don't spawn electron windows, mainly for testing
const watchMode = process.argv.includes('--watch');

/** Messages on stderr that match any of the contained patterns will be stripped from output */
const stderrFilterPatterns = [
  // warning about devtools extension
  // https://github.com/cawa-93/vite-electron-builder/issues/492
  // https://github.com/MarshallOfSound/electron-devtools-installer/issues/143
  /ExtensionLoadWarning/,
];

let spawnProcess: ChildProcessWithoutNullStreams | null = null;

async function spawnOrReloadElectron() {
  if (watchMode) {
    return;
  }
  if (spawnProcess !== null && spawnProcess.pid) {
    const { resolve, reject, promise } = Promise.withResolvers<void>();
    spawnProcess.off('exit', process.exit);
    kill(spawnProcess.pid, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    spawnProcess = null;
    await promise;
  }

  const ext = process.platform === 'win32' ? '.cmd' : '';
  const exe = resolve(electronDir, 'node_modules', '.bin', `electron${ext}`);

  // remove import loader option
  const NODE_OPTIONS = process.env.NODE_OPTIONS;
  if (NODE_OPTIONS) {
    process.env.NODE_OPTIONS = NODE_OPTIONS.replace(/--import=[^\s]*/, '');
  }

  console.log('spawn electron', exe, electronDir);

  spawnProcess = spawn(exe, ['.', '--inspect'], {
    cwd: electronDir,
    env: process.env,
    shell: true,
  });

  spawnProcess.stdout.on('data', d => {
    const str = d.toString().trim();
    if (str) {
      console.log(str);
    }
  });

  spawnProcess.stderr.on('data', d => {
    const data = d.toString().trim();
    if (!data) return;
    const mayIgnore = stderrFilterPatterns.some(r => r.test(data));
    if (mayIgnore) return;
    console.error(data);
  });

  // Stops the watch script when the application has quit
  spawnProcess.on('exit', code => {
    if (code && code !== 0) {
      console.error(`Electron exited with code ${code}`);
    }
  });
}

const debouncedSpawnOrReloadElectron = debounce(spawnOrReloadElectron, 500);

const common = config();

async function watchLayers() {
  let initialBuild = false;
  return new Promise<BuildContext>(resolve => {
    const buildContextPromise = esbuild.context({
      ...common,
      plugins: [
        ...(common.plugins ?? []),
        {
          name: 'electron-dev:reload-app-on-layers-change',
          setup(build) {
            build.onEnd(() => {
              if (initialBuild) {
                console.log(`[layers] has changed, [re]launching electron...`);
                debouncedSpawnOrReloadElectron();
              } else {
                buildContextPromise.then(resolve).catch(e => {
                  console.error(e);
                });
                initialBuild = true;
              }
            });
          },
        },
      ],
    });
    buildContextPromise
      .then(buildContext => {
        return buildContext.watch();
      })
      .catch(e => {
        console.error(e);
      });
  });
}

async function main() {
  await watchLayers();

  if (watchMode) {
    console.log(`Watching for changes...`);
  } else {
    console.log('Starting electron...');
    debouncedSpawnOrReloadElectron();
    console.log(`Electron is started, watching for changes...`);
  }
}

main();
