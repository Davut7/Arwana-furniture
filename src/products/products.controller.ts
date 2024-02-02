import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProducts.dto';
import { AuthGuard } from 'src/admin/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { imageFilter } from 'src/helpers/filters/imageFilter';
import { videoFilter } from 'src/helpers/filters/videoFilter';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductEntity } from './entities/product.entity';
import { CreateMediaDto } from 'src/helpers/swagger/mediaEntity.dto';
import { FileUploadDto } from 'src/helpers/swagger/fileUpload.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCreatedResponse({
    type: CreateProductDto,
    description: 'Created product',
  })
  @ApiBody({ type: CreateProductDto, description: 'Data to create product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBearerAuth()
  @Post(':id')
  @UseGuards(AuthGuard)
  createProduct(
    @Param('id', ParseUUIDPipe) brandCategoryId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.createProduct(dto, brandCategoryId);
  }

  @ApiOkResponse({ type: ProductEntity, description: 'Find all products' })
  @Get()
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @ApiOkResponse({ type: ProductEntity, description: 'Find one product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @Get(':id')
  findOneProducts(@Param('id', ParseUUIDPipe) productId: string) {
    return this.productsService.findOneProduct(productId);
  }

  @ApiCreatedResponse({
    type: CreateProductDto,
    description: 'Updated product',
  })
  @ApiBody({ type: UpdateProductDto, description: 'Data to update product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard)
  updateProducts(
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(productId, dto);
  }

  @ApiProperty({ description: 'Product deleted successfully' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProducts(@Param('id', ParseUUIDPipe) productId: string) {
    return this.productsService.deleteProduct(productId);
  }

  @ApiCreatedResponse({ type: CreateMediaDto, description: 'Image uploaded' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product image',
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
    @Param('id', ParseUUIDPipe) productId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productsService.uploadImage(productId, image);
  }

  @ApiParam({ name: 'brandId', description: 'Brand ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiBearerAuth()
  @ApiResponse({ description: 'Image deleted successfully!' })
  @Delete('/:productId/image/:imageId')
  @UseGuards(AuthGuard)
  deleteImage(
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.productsService.deleteImage(productId, imageId);
  }

  @ApiCreatedResponse({ type: CreateMediaDto, description: 'Video uploaded' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product video',
    type: FileUploadDto,
  })
  @ApiBearerAuth()
  @Post('/video/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('video', {
      storage: memoryStorage(),
      fileFilter: videoFilter,
      limits: {
        fieldSize: 200 * 1024 * 1024,
      },
    }),
  )
  uploadVideo(
    @Param('id', ParseUUIDPipe) productId: string,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.productsService.uploadVideo(productId, video);
  }

  @ApiParam({ name: 'brandId', description: 'Brand ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiBearerAuth()
  @ApiResponse({ description: 'Video deleted successfully!' })
  @Delete('/:productId/video/:videoId')
  @UseGuards(AuthGuard)
  deleteVideo(
    @Param('videoId', ParseUUIDPipe) videoId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.productsService.deleteVideo(productId, videoId);
  }
}
