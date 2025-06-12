import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

export async function bootstrap() {
  // Process setup for parentPort message handling is done inside HelperBootstrapService
  // which is automatically instantiated when the module initializes
  const app = await NestFactory.createApplicationContext(AppModule, {});

  // Handle shutdown
  process.on('exit', () => {
    app.close().catch(err => {
      console.error('Failed to close Nest application context', err);
    });
  });

  return app;
}
