import { Module } from '@nestjs/common';
import { BrandCategoryService } from './brand-category.service';
import { BrandCategoryController } from './brand-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { CategoryBrandEntity } from './entities/brandCategory.entity';
import { BrandsEntity } from 'src/brands/entities/brands.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BrandsEntity,
      CategoryEntity,
      CategoryBrandEntity,
    ]),
    SharedModule,
  ],
  controllers: [BrandCategoryController],
  providers: [BrandCategoryService],
  exports: [BrandCategoryService],
})
export class BrandCategoryModule {}
