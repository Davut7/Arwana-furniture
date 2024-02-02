import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { MediaEntity } from 'src/helpers/entities/media.entity';
import { BrandsModule } from 'src/brands/brands.module';
import { SharedModule } from 'src/shared/shared.module';
import { CategoryBrandEntity } from 'src/brand-category/entities/brandCategory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      MediaEntity,
      CategoryBrandEntity,
    ]),
    SharedModule,
    forwardRef(() => BrandsModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
