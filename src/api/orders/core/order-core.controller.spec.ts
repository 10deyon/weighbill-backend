import { Test, TestingModule } from '@nestjs/testing';
import { OrderCoreController } from './order-core.controller';

describe('OrderCoreController', () => {
  let controller: OrderCoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderCoreController],
    }).compile();

    controller = module.get<OrderCoreController>(OrderCoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
