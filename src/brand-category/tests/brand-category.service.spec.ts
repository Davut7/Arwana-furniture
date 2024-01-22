import { Test, TestingModule } from '@nestjs/testing';
import { BrandCategoryService } from '../brand-category.service';

describe('BrandCategoryService', () => {
  let service: BrandCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandCategoryService],
    }).compile();

    service = module.get<BrandCategoryService>(BrandCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
