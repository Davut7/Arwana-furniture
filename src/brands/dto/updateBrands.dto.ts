import { PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './crateBrands.dto';

export class UpdateBrandsDto extends PartialType(CreateBrandDto) {}
