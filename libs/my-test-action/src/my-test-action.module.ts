import { Module } from '@nestjs/common';
import { MyTestActionService } from './my-test-action.service';

@Module({
  providers: [MyTestActionService],
  exports: [MyTestActionService],
})
export class MyTestActionModule {}
