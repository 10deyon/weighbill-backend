import { Test, TestingModule } from '@nestjs/testing';
import { LocationManagerController } from './location-manager.controller';

describe('LocationManagerController', () => {
  let controller: LocationManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationManagerController],
    }).compile();

    controller = module.get<LocationManagerController>(LocationManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
