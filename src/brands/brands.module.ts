import { Module, forwardRef } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsEntity } from './entities/brands.entity';

import { MediaEntity } from 'src/helpers/entities/media.entity';

import { CategoryModule } from 'src/category/category.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrandsEntity, MediaEntity]),
    SharedModule,
    forwardRef(() => CategoryModule),
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
