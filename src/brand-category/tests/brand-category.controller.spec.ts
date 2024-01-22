import { Test, TestingModule } from '@nestjs/testing';
import { BrandCategoryController } from '../brand-category.controller';
import { BrandCategoryService } from '../brand-category.service';

describe('BrandCategoryController', () => {
  let controller: BrandCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandCategoryController],
      providers: [BrandCategoryService],
    }).compile();

    controller = module.get<BrandCategoryController>(BrandCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
