import { Test, TestingModule } from '@nestjs/testing';
import { DicerollerGateway } from './diceroller.gateway';

describe('DicerollerGateway', () => {
  let gateway: DicerollerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DicerollerGateway],
    }).compile();

    gateway = module.get<DicerollerGateway>(DicerollerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
