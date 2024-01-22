import { OmitType } from '@nestjs/swagger';
import { MediaEntity } from '../entities/media.entity';

export class CreateMediaDto extends OmitType(MediaEntity, [
  'brand',
  'category',
  'deletedAt',
  'updatedAt',
  'product',
] as const) {}
