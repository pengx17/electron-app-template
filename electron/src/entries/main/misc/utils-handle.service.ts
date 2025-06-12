import { Injectable } from '@nestjs/common';
import { app, clipboard, nativeImage, shell } from 'electron';

import { IpcHandle, IpcScope } from '../../../ipc';

@Injectable()
export class UtilsHandleService {
  @IpcHandle({ scope: IpcScope.UI })
  handleCloseApp() {
    app.quit();
  }

  @IpcHandle({ scope: IpcScope.UI })
  restartApp() {
    app.relaunch();
    app.quit();
  }

  @IpcHandle({ scope: IpcScope.UI })
  writeImageToClipboard(buffer: ArrayBuffer) {
    const image = nativeImage.createFromBuffer(Buffer.from(buffer));
    if (image.isEmpty()) return false;
    clipboard.writeImage(image);
    return true;
  }

  @IpcHandle({ scope: IpcScope.UI })
  openExternal(url: string) {
    return shell.openExternal(url);
  }
}
