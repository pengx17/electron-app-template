import { Module } from '@nestjs/common';

import { ElectronIpcModule } from '../../ipc';
import { HelperProcessModule } from './helper-process';
import { WindowsModule } from './windows';
import { MiscModule } from './misc';

@Module({
  imports: [
    ElectronIpcModule.forMain(),
    HelperProcessModule,
    WindowsModule,
    MiscModule,
  ],
})
export class AppModule {}
