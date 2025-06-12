import { spawnSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productName = 'electron-template';

const makers = [
  {
    name: '@electron-forge/maker-zip',
    config: {
      name: productName,
      platforms: ['darwin', 'linux', 'win32'],
    },
  },
].filter(Boolean);

/**
 * @type {import('@electron-forge/shared-types').ForgeConfig}
 */
export default {
  packagerConfig: {
    name: productName,
    appBundleId: `com.example.${productName}`,
    executableName: productName,
    asar: true,
  },
  makers,
  plugins: [{ name: '@electron-forge/plugin-auto-unpack-natives', config: {} }],
  hooks: {
    generateAssets: () => {
      spawnSync('yarn', ['generate-assets'], {
        stdio: 'inherit',
        cwd: __dirname,
      });
    },
  },
};
