import { Module } from '@nestjs/common';

import { HelperProcessModule } from '../helper-process';
import { MainWindowManager } from './main-window.service';
import { WindowsService } from './windows.service';

@Module({
  providers: [MainWindowManager, WindowsService],
  exports: [MainWindowManager],
  imports: [HelperProcessModule],
})
export class WindowsModule {}
