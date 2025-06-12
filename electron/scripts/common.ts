import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { BuildOptions, Plugin } from 'esbuild';
import esbuildPluginTsc from 'esbuild-plugin-tsc';

export const electronDir = fileURLToPath(new URL('..', import.meta.url));

export const rootDir = resolve(electronDir, '..', '..');

export const NODE_MAJOR_VERSION = 18;

export const mode = (process.env.NODE_ENV =
  process.env.NODE_ENV || 'development');

export const config = (): BuildOptions => {
  const plugins: Plugin[] = [
    // ensures nestjs decorators are working (emitDecoratorMetadata not supported in esbuild)
    esbuildPluginTsc({
      tsconfigPath: resolve(electronDir, 'tsconfig.json'),
    }),
  ];

  return {
    entryPoints: [
      resolve(electronDir, './src/entries/main/index.ts'),
      resolve(electronDir, './src/entries/preload/index.ts'),
      resolve(electronDir, './src/entries/helper/index.ts'),
    ],
    entryNames: '[dir]',
    outdir: resolve(electronDir, './dist'),
    bundle: true,
    target: `node${NODE_MAJOR_VERSION}`,
    platform: 'node',
    external: [
      'electron',
      'semver',
      // nestjs related:
      '@nestjs/platform-express',
      '@nestjs/microservices',
      '@nestjs/websockets/socket-module',
      '@apollo/subgraph',
      '@apollo/gateway',
      'ts-morph',
      'class-validator',
      'class-transformer',
    ],
    format: 'cjs',
    loader: {
      '.node': 'copy',
    },
    assetNames: '[name]',
    treeShaking: true,
    sourcemap: 'linked',
    plugins,
  };
};
