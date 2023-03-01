import { Test, TestingModule } from '@nestjs/testing';
import { UserCoreService } from './user.service';

describe('UserCoreService', () => {
  let service: UserCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCoreService],
    }).compile();

    service = module.get<UserCoreService>(UserCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
