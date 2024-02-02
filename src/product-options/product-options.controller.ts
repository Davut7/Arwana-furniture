import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductOptionsService } from './product-options.service';
import { CreateProductOptionsDto } from './dto/createProductOptions.dto';
import { UpdateProductOptionsDto } from './dto/updateProductOptions.dto';
import { AuthGuard } from 'src/admin/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateMediaDto } from 'src/helpers/swagger/mediaEntity.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { imageFilter } from 'src/helpers/filters/imageFilter';
import { FileUploadDto } from 'src/helpers/swagger/fileUpload.dto';

@Controller('/products/options')
export class ProductOptionsController {
  constructor(private readonly productOptionsService: ProductOptionsService) {}

  @UseGuards(AuthGuard)
  @Post(':id')
  async createProductOptions(
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() dto: CreateProductOptionsDto,
  ) {
    return this.productOptionsService.createProductOptions(productId, dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateProductOptions(
    @Param('id', ParseUUIDPipe) productOptionsId: string,
    @Body() dto: UpdateProductOptionsDto,
  ) {
    return await this.productOptionsService.updateProductOptions(
      productOptionsId,
      dto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteProductOptions(
    @Param('id', ParseUUIDPipe) productOptionsId: string,
  ) {
    return await this.productOptionsService.deleteProductOptions(
      productOptionsId,
    );
  }

  @ApiCreatedResponse({ type: CreateMediaDto, description: 'Image uploaded' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product options image',
    type: FileUploadDto,
  })
  @ApiBearerAuth()
  @Post('/image/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: imageFilter,
      limits: {
        fieldSize: 25 * 1024 * 1024,
      },
    }),
  )
  uploadImage(
    @Param('id', ParseUUIDPipe) productOptionsId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productOptionsService.uploadImage(productOptionsId, image);
  }

  @ApiParam({ name: 'productOptionsId', description: 'Product Images ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiBearerAuth()
  @ApiResponse({ description: 'Image deleted successfully!' })
  @Delete('/:productOptionsId/image/:imageId')
  @UseGuards(AuthGuard)
  deleteImage(
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @Param('productOptionsId', ParseUUIDPipe) productOptionsId: string,
  ) {
    return this.productOptionsService.deleteImage(productOptionsId, imageId);
  }
}
