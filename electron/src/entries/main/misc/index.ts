import { Module } from '@nestjs/common';

import { WindowsModule } from '../windows';
import { ProtocolService } from './protocol.service';
import { SecurityService } from './security.service';
import { UtilsHandleService } from './utils-handle.service';

@Module({
  providers: [ProtocolService, SecurityService, UtilsHandleService],
  imports: [WindowsModule],
})
export class MiscModule {}

export * from './protocol.service';
export * from './security.service';
export * from './utils-handle.service';
