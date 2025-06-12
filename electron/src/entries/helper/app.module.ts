import { Module } from '@nestjs/common';

import { ElectronIpcModule } from '../../ipc';
import { HelperBootstrapService } from './helper-bootstrap.service';
import { MainRpcModule } from './main-rpc';
import { TestModule } from './test';

/**
 * Main module for the helper process
 */
@Module({
  imports: [
    ElectronIpcModule.forHelper(),
    MainRpcModule,
    // Feature modules
    TestModule,
  ],
  providers: [HelperBootstrapService],
})
export class AppModule {}
