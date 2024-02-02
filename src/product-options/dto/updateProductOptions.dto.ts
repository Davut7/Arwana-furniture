import { PartialType } from '@nestjs/swagger';
import { CreateProductOptionsDto } from './createProductOptions.dto';

export class UpdateProductOptionsDto extends PartialType(
  CreateProductOptionsDto,
) {}
