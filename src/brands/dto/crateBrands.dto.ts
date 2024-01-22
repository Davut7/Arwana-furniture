import { OmitType } from '@nestjs/swagger';
import { BrandsEntity } from '../entities/brands.entity';

export class CreateBrandDto extends OmitType(BrandsEntity, [
  'createdAt',
  'deletedAt',
  'id',
  'updatedAt',
] as const) {}
