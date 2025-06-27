import { app } from 'electron';

// Platform detection utilities
export const isMacOS = () => {
  return process.platform === 'darwin';
};

export const isWindows = () => {
  return process.platform === 'win32';
};

export const isLinux = () => {
  return process.platform === 'linux';
};

export const ensureAppReady = async () => {
  if (app.isReady()) {
    return;
  }

  await new Promise(resolve => app.once('ready', resolve));
};
