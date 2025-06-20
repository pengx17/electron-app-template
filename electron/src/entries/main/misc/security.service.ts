import { Injectable, type OnModuleInit } from '@nestjs/common';
import { app, shell } from 'electron';

@Injectable()
export class SecurityService implements OnModuleInit {
  onModuleInit() {
    app.on('web-contents-created', (_, contents) => {
      const isInternalUrl = (url: string) => {
        return url.startsWith('file://.');
      };
      /**
       * Block navigation to origins not on the allowlist.
       *
       * Navigation is a common attack vector. If an attacker can convince the app to navigate away
       * from its current page, they can possibly force the app to open web sites on the Internet.
       *
       * @see https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
       */
      contents.on('will-navigate', (event, url) => {
        if (isInternalUrl(url)) {
          return;
        }
        // Prevent navigation
        event.preventDefault();
        shell.openExternal(url).catch(console.error);
      });

      /**
       * Hyperlinks to allowed sites open in the default browser.
       *
       * The creation of new `webContents` is a common attack vector. Attackers attempt to convince the app to create new windows,
       * frames, or other renderer processes with more privileges than they had before; or with pages opened that they couldn't open before.
       * You should deny any unexpected window creation.
       *
       * @see https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
       * @see https://www.electronjs.org/docs/latest/tutorial/security#15-do-not-use-openexternal-with-untrusted-content
       */
      contents.setWindowOpenHandler(({ url }) => {
        if (!isInternalUrl(url) || url.includes('/redirect-proxy')) {
          // Open default browser
          shell.openExternal(url).catch(console.error);
        }
        // Prevent creating new window in application
        return { action: 'deny' };
      });
    });
  }
}
