import { Module } from '@nestjs/common';
import { MyActionService } from './my-action.service';

@Module({
  providers: [MyActionService],
  exports: [MyActionService],
})
export class MyActionModule {}
