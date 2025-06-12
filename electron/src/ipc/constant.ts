export enum IpcScope {
  UI = 'ui',
  MENU = 'menu',
  HELPER = 'helper',
}

export const IPC_API_CHANNEL_NAME = 'ipc-api';
export const IPC_EVENT_CHANNEL_NAME = 'ipc-event';

export const RENDERER_CONNECT_CHANNEL_NAME = 'renderer-connect';
export const HELPER_CONNECT_CHANNEL_NAME = 'helper-connect';
export const WORKER_CONNECT_CHANNEL_NAME = 'worker-connect';
