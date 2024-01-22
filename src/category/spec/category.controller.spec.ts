import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { MinioModule } from 'src/minio/minio.module';

describe('CategoryController', () => {
  let controller: CategoryController;

  const mockCategoryService = {};

  const mockMinioService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MinioModule],
      controllers: [CategoryController],
      providers: [CategoryService],
    })
      .overrideProvider(CategoryService)
      .useValue(mockCategoryService)
      .compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
