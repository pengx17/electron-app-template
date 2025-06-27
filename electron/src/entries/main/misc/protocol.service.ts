import { join } from 'node:path';

import { Injectable, type OnModuleInit } from '@nestjs/common';
import { app, net, protocol } from 'electron';

import { anotherHost, mainHost, resourcesPath } from '../constants';
import { logger } from '../logger';
import { ensureAppReady } from '../utils';

export function registerSchemes() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'assets',
      privileges: {
        secure: false,
        corsEnabled: true,
        supportFetchAPI: true,
        standard: true,
        bypassCSP: true,
      },
    },
  ]);

  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'file',
      privileges: {
        secure: false,
        corsEnabled: true,
        supportFetchAPI: true,
        standard: true,
        bypassCSP: true,
        stream: true,
      },
    },
  ]);
}

const webStaticDir = join(resourcesPath, 'web-static');

@Injectable()
export class ProtocolService implements OnModuleInit {
  async onModuleInit() {
    await ensureAppReady();
    this.setupInterceptors();
  }

  private readonly handleFileRequest = async (request: Request) => {
    const urlObject = new URL(request.url);

    if (urlObject.host === anotherHost) {
      urlObject.host = mainHost;
    }

    const isAbsolutePath = urlObject.host !== '.';
    const isViteDevServer = urlObject.pathname.includes('/@vite');

    // Redirect to webpack dev server if defined
    if (process.env.DEV_SERVER_URL && (!isAbsolutePath || isViteDevServer)) {
      const devServerUrl = new URL(
        urlObject.pathname,
        process.env.DEV_SERVER_URL
      );
      logger.log('redirecting to dev server', devServerUrl.toString());
      return net.fetch(devServerUrl.toString(), request);
    }
    const clonedRequest = Object.assign(request.clone(), {
      bypassCustomProtocolHandlers: true,
    });
    // this will be file types (in the web-static folder)
    let filepath = '';

    // for relative path, load the file in resources
    if (!isAbsolutePath) {
      if (urlObject.pathname.split('/').at(-1)?.includes('.')) {
        // Sanitize pathname to prevent path traversal attacks
        const decodedPath = decodeURIComponent(urlObject.pathname);
        const normalizedPath = join(webStaticDir, decodedPath).normalize();
        if (!normalizedPath.startsWith(webStaticDir)) {
          // Attempted path traversal - reject by using empty path
          filepath = join(webStaticDir, '');
        } else {
          filepath = normalizedPath;
        }
      } else {
        // else, fallback to load the index.html instead
        filepath = join(webStaticDir, 'index.html');
      }
    } else {
      filepath = decodeURIComponent(urlObject.pathname);
      // security check if the filepath is within app.getPath('sessionData')
      const sessionDataPath = app.getPath('sessionData');
      const tempPath = app.getPath('temp');
      if (
        !filepath.startsWith(sessionDataPath) &&
        !filepath.startsWith(tempPath)
      ) {
        throw new Error('Invalid filepath', { cause: filepath });
      }
    }
    return net.fetch('file://' + filepath, clonedRequest);
  };

  setupInterceptors = () => {
    logger.log('setting up interceptors', 'ProtocolService');
    protocol.handle('file', request => {
      return this.handleFileRequest(request);
    });

    protocol.handle('assets', request => {
      return this.handleFileRequest(request);
    });
  };
}
