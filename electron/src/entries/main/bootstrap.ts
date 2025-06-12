import { NestFactory } from '@nestjs/core';
import { app as electronApp } from 'electron';

import { isDev } from '../../shared/constants';
import { AppModule } from './app.module';
import { logger } from './logger';

function enableSandbox() {
  electronApp.enableSandbox();
}

function setupCommandLine() {
  electronApp.commandLine.appendSwitch('enable-features', 'CSSTextAutoSpace');

  if (isDev) {
    // In electron the dev server will be resolved to 0.0.0.0, but it
    // might be blocked by electron.
    // See https://github.com/webpack/webpack-dev-server/pull/384
    electronApp.commandLine.appendSwitch('host-rules', 'MAP 0.0.0.0 127.0.0.1');
  }

  // https://github.com/electron/electron/issues/43556
  electronApp.commandLine.appendSwitch(
    'disable-features',
    'PlzDedicatedWorker'
  );
}

function ensureSingleInstance() {
  /**
   * Prevent multiple instances
   */
  const isSingleInstance = electronApp.requestSingleInstanceLock();
  if (!isSingleInstance) {
    logger.log(
      'Another instance is running or responding deep link, exiting...'
    );
    electronApp.quit();
    process.exit(0);
  }
}

// some settings must be called before ready
function beforeReady() {
  enableSandbox();
  setupCommandLine();
  ensureSingleInstance();
}

export async function bootstrap() {
  beforeReady();
  const context = await NestFactory.createApplicationContext(AppModule, {
    logger: logger,
  });

  // Close on Electron quit
  electronApp.on('before-quit', () => {
    context.close().catch(err => {
      logger.error(err);
    });
  });
}
