export const appInfo = {
  electron: true,
  windowName:
    process.argv.find(arg => arg.startsWith('--window-name='))?.split('=')[1] ??
    'unknown',
  viewId:
    process.argv.find(arg => arg.startsWith('--view-id='))?.split('=')[1] ??
    'unknown',
};

export type AppInfo = typeof appInfo;
