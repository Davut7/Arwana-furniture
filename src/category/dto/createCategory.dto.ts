import { OmitType } from '@nestjs/swagger';
import { CategoryEntity } from '../entities/category.entity';

export class CreateCategoryDto extends OmitType(CategoryEntity, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
  'medias',
] as const) {}
