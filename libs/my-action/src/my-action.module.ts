import { Module } from '@nestjs/common';
import { BuyMeAFuelCanService } from './my-action.service';

@Module({
  providers: [BuyMeAFuelCanService],
  exports: [BuyMeAFuelCanService],
})
export class MyActionModule {}
