import { Test, TestingModule } from '@nestjs/testing';
import { LocationManagerService } from './location-manager.service';

describe('LocationManagerService', () => {
  let service: LocationManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationManagerService],
    }).compile();

    service = module.get<LocationManagerService>(LocationManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
