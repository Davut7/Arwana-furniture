import { OmitType } from '@nestjs/swagger';
import { ProductOptionsEntity } from '../entities/productOptions.entity';

export class CreateProductOptionsDto extends OmitType(ProductOptionsEntity, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
]) {}
