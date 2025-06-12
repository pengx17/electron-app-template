import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import debug from 'debug';

const log = debug('affine:make-env');

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const ROOT = path.resolve(__dirname, '..');

const iconPngPath = path.join(ROOT, './resources/icons/icon.png');

const {
  values: { arch, platform },
} = parseArgs({
  options: {
    arch: {
      type: 'string',
      description: 'The architecture to build for',
      default: process.arch,
    },
    platform: {
      type: 'string',
      description: 'The platform to build for',
      default: process.platform,
    },
  },
});

log(`parsed args: arch=${arch}, platform=${platform}`);

const appIdMap = {
  internal: 'com.electron-template.internal',
  canary: 'com.electron-template.canary',
  beta: 'com.electron-template.beta',
  stable: 'com.electron-template.app',
};

export { appIdMap, arch, iconPngPath, platform, ROOT };
