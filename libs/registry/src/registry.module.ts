import { Module } from '@nestjs/common';

import { CrossChainSwapService } from '@action/cross-chain-swap';

import { RegistryService } from './registry.service';

@Module({
  imports: [
    CrossChainSwapService,
  ],
  providers: [RegistryService],
  exports: [RegistryService],
})
export class RegistryModule {}
