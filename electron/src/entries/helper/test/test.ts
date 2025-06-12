import { Injectable } from '@nestjs/common';
import { IpcHandle, IpcScope } from '../../../ipc';

@Injectable()
export class TestService {
  @IpcHandle({
    scope: IpcScope.HELPER,
  })
  async test() {
    return 'test';
  }
}
