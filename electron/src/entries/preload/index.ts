import { contextBridge } from 'electron';

import { appInfo } from './api-info';
import { exposedEvents } from './ipc-events';
import { exposedApis } from './ipc-handlers';
import { listenWorkerApis } from './worker';

contextBridge.exposeInMainWorld('__appInfo', appInfo);
contextBridge.exposeInMainWorld('__apis', exposedApis);
contextBridge.exposeInMainWorld('__events', exposedEvents);

listenWorkerApis();
