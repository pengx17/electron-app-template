import { app, shell } from 'electron';
import log from 'electron-log/main';

// Initialize electron-log (only once)
log.initialize({ preload: false });

if (process.env.NODE_ENV === 'development') {
  log.transports.file.level = 'debug';
  log.transports.console.level = 'debug';
} else {
  log.transports.file.level = 'info';
  log.transports.console.level = 'info';
}

export function getLogFilePath() {
  return log.transports.file.getFile().path;
}

export async function revealLogFile() {
  const filePath = getLogFilePath();
  return await shell.openPath(filePath);
}

app?.on('before-quit', () => {
  log.transports.console.level = false;
});

export const logger = log.scope('main');

export { log };
