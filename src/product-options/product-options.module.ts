import { Module } from '@nestjs/common';
import { ProductOptionsService } from './product-options.service';
import { ProductOptionsController } from './product-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOptionsEntity } from './entities/productOptions.entity';
import { SharedModule } from 'src/shared/shared.module';
import { ProductsModule } from 'src/products/products.module';
import { MediaEntity } from 'src/helpers/entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOptionsEntity, MediaEntity]),
    SharedModule,
    ProductsModule,
  ],
  controllers: [ProductOptionsController],
  providers: [ProductOptionsService],
})
export class ProductOptionsModule {}
