import {
  Controller,
  Post,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { BrandCategoryService } from './brand-category.service';
import { AuthGuard } from 'src/admin/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('brand-category')
@Controller('brand-category')
export class BrandCategoryController {
  constructor(private readonly brandCategoryService: BrandCategoryService) {}

  @ApiCreatedResponse({ type: String })
  @ApiBearerAuth()
  @Post(':brandId/:categoryId')
  @UseGuards(AuthGuard)
  async addBrandCategoryRelation(
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    return this.brandCategoryService.addBrandCategoryRelation(
      brandId,
      categoryId,
    );
  }

  @ApiOkResponse({
    type: String,
    description: 'Brand category deleted successfully!',
  })
  @UseGuards(AuthGuard)
  @Delete(':brandId/:categoryId')
  async deleteBrandCategory(
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    return this.brandCategoryService.deleteCategoryBrand(brandId, categoryId);
  }
}
