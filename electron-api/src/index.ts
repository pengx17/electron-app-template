import type { ElectronApis } from './ipc-api-types.gen';
import type { ElectronEvents } from './ipc-event-types.gen';

declare global {
  // oxlint-disable-next-line no-var
  var __appInfo: {
    electron: boolean;
    scheme: string;
    windowName: string;
  };
  // oxlint-disable-next-line no-var
  var __apis: ClientHandler | undefined;
  // oxlint-disable-next-line no-var
  var __events: ClientEvents | undefined;
}

export type ClientEvents = ElectronEvents;
export type ClientHandler = ElectronApis;

export const apis = globalThis.__apis as ClientHandler | undefined;
export const events = globalThis.__events as ClientEvents | undefined;

export * from './ipc-api-types.gen';
export * from './ipc-event-types.gen';
