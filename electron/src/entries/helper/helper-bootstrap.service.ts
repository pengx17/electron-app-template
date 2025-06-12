import { Injectable, type OnModuleInit } from '@nestjs/common';
import { AsyncCall } from 'async-call-rpc';
import type { MessagePortMain } from 'electron';

import { RENDERER_CONNECT_CHANNEL_NAME, IpcScanner } from '../../ipc';
import type { RendererToHelper } from './types';

/**
 * Service that handles the initial bootstrap of the helper process
 * and sets up the connection to the renderer process
 */
@Injectable()
export class HelperBootstrapService implements OnModuleInit {
  constructor(private readonly ipcScanner: IpcScanner) {}

  /**
   * Initialize the helper process, setting up message listeners for renderer connection
   */
  onModuleInit(): void {
    console.log(`Helper bootstrap started`);
    // Check if we're in a worker environment with a parent port
    if (!process.parentPort) {
      console.error('Helper process was not started in a worker environment');
      return;
    }

    // Listen for 'renderer-connect' messages from the main process
    process.parentPort.on('message', e => {
      if (
        e.data.channel === RENDERER_CONNECT_CHANNEL_NAME &&
        e.ports.length === 1
      ) {
        this.connectToRenderer(e.ports[0]);
        console.debug('Renderer connected');
      }
    });

    console.log('Helper bootstrap complete, waiting for renderer connection');
  }

  connectToRenderer(rendererPort: MessagePortMain) {
    const handlers = this.ipcScanner.scanHandlers();
    const flattenedHandlers = Array.from(handlers.entries()).map(
      ([channel, handler]) => {
        const handlerWithLog = async (...args: any[]) => {
          try {
            const start = performance.now();
            const result = await handler(...args);
            console.debug(
              `${channel}`,
              'async-api',
              `${args.filter(
                arg => typeof arg !== 'function' && typeof arg !== 'object'
              )} - ${(performance.now() - start).toFixed(2)} ms`
            );
            return result;
          } catch (error) {
            console.error(`${channel}`, String(error), 'async-api');
            throw error; // Re-throw to ensure error is communicated back
          }
        };
        return [channel, handlerWithLog];
      }
    );

    AsyncCall<RendererToHelper>(Object.fromEntries(flattenedHandlers), {
      channel: {
        on(listener) {
          const f = (e: Electron.MessageEvent) => {
            listener(e.data);
          };
          rendererPort.on('message', f);
          // MUST start the connection to receive messages
          rendererPort.start();
          return () => {
            rendererPort.off('message', f);
          };
        },
        send(data) {
          rendererPort.postMessage(data);
        },
      },
      log: false,
    });
  }
}
