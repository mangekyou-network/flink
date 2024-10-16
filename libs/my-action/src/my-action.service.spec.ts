import { Test, TestingModule } from '@nestjs/testing';
import { BuyMeAFuelCanService } from './my-action.service';

describe('MyActionService', () => {
  let service: BuyMeAFuelCanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyMeAFuelCanService],
    }).compile();

    service = module.get<BuyMeAFuelCanService>(BuyMeAFuelCanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
