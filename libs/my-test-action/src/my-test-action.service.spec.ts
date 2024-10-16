import { Test, TestingModule } from '@nestjs/testing';
import { MyTestActionService } from './my-test-action.service';

describe('MyTestActionService', () => {
  let service: MyTestActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyTestActionService],
    }).compile();

    service = module.get<MyTestActionService>(MyTestActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
