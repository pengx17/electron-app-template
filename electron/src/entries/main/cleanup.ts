import { app } from 'electron';

import { logger } from './logger';

const beforeAppQuitRegistry: (() => void)[] = [];

export function beforeAppQuit(fn: () => void) {
  beforeAppQuitRegistry.push(fn);
}

app.on('before-quit', () => {
  beforeAppQuitRegistry.forEach(fn => {
    // some cleanup functions might throw on quit and crash the app
    try {
      fn();
    } catch (err) {
      logger.warn('cleanup error on quit', err);
    }
  });
});
