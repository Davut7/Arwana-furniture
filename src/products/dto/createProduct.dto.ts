import { OmitType } from '@nestjs/swagger';
import { ProductEntity } from '../entities/product.entity';

export class CreateProductDto extends OmitType(ProductEntity, [
  'createdAt',
  'deletedAt',
  'updatedAt',
  'id',
  'medias',
] as const) {}
