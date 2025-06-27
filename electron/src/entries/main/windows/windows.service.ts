import { Injectable, type OnModuleInit } from '@nestjs/common';

import { MainWindowManager } from './main-window.service';
import { logger } from '../logger';
import { ensureAppReady } from '../utils';

/**
 * This service is responsible for managing the windows of the application.
 * AKA the "launcher".
 */
@Injectable()
export class WindowsService implements OnModuleInit {
  constructor(private readonly mainWindowService: MainWindowManager) {}

  async onModuleInit() {
    await ensureAppReady();
    logger.log('app is ready');
    this.initializeMainWindow().catch(err => {
      logger.error('Failed to initialize main window', err);
    });
  }

  async initializeMainWindow() {
    return this.mainWindowService.initAndShowMainWindow();
  }

  async getMainWindow() {
    return this.mainWindowService.getMainWindow();
  }
}
