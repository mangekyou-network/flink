import { Module } from '@nestjs/common';

import { RegistryService } from './registry.service';
import { MyActionModule } from 'libs/my-action/src';

@Module({
  imports: [MyActionModule],
  providers: [RegistryService],
  exports: [RegistryService],
})
export class RegistryModule {}
