import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { MediaEntity } from 'src/helpers/entities/media.entity';
import { SharedModule } from 'src/shared/shared.module';
import { BrandCategoryModule } from 'src/brand-category/brand-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, MediaEntity]),
    SharedModule,
    BrandCategoryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
