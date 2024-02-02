import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/crateBrands.dto';
import { UpdateBrandsDto } from './dto/updateBrands.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { imageFilter } from 'src/helpers/filters/imageFilter';
import { videoFilter } from 'src/helpers/filters/videoFilter';
import { AuthGuard } from 'src/admin/guards/auth.guard';
import { catalogFilter } from 'src/helpers/filters/catalogFilter';
import { Response } from 'express';
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
import { BrandsEntity } from './entities/brands.entity';
import { FileUploadDto } from 'src/helpers/swagger/fileUpload.dto';
import { CreateMediaDto } from 'src/helpers/swagger/mediaEntity.dto';

@ApiTags('brands')
@Controller('/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiCreatedResponse({ type: CreateBrandDto, description: 'Created brand' })
  @ApiBody({ type: CreateBrandDto, description: 'Data to create brand' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  createBrand(@Body() dto: CreateBrandDto) {
    return this.brandsService.createBrand(dto);
  }

  @ApiOkResponse({ type: [BrandsEntity], description: 'Find all brands' })
  @Get()
  findBrands() {
    return this.brandsService.findBrands();
  }

  @ApiOkResponse({ type: BrandsEntity, description: 'Find one brand' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @Get(':id')
  findOneBrand(@Param('id', ParseUUIDPipe) brandId: string) {
    return this.brandsService.findOneBrand(brandId);
  }

  @ApiCreatedResponse({ type: CreateBrandDto, description: 'Updated brand' })
  @ApiBody({ type: UpdateBrandsDto, description: 'Data to update brand' })
  @ApiParam({ name: 'id', description: 'Brand ID' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard)
  updateBrand(
    @Param('id', ParseUUIDPipe) brandId: string,
    @Body() dto: UpdateBrandsDto,
  ) {
    return this.brandsService.updateBrand(brandId, dto);
  }

  @ApiProperty({ description: 'Brand deleted successfully' })
  @ApiParam({ name: 'id', description: 'Brand ID' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteBrand(@Param('id', ParseUUIDPipe) brandId: string) {
    return this.brandsService.deleteBrand(brandId);
  }

  @ApiCreatedResponse({ type: CreateMediaDto, description: 'Image uploaded' })
  @ApiParam({ name: 'id', description: 'Brand ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Brand image',
    type: FileUploadDto,
  })
  @ApiBearerAuth()
  @Post('/image/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: imageFilter,
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  uploadImage(
    @Param('id', ParseUUIDPipe) brandId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.brandsService.uploadImage(brandId, image);
  }

  @ApiParam({ name: 'brandId', description: 'Brand ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiBearerAuth()
  @Delete('/:brandId/image/:imageId')
  @UseGuards(AuthGuard)
  deleteImage(
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.brandsService.deleteImage(imageId, brandId);
  }

  @ApiCreatedResponse({ type: CreateMediaDto, description: 'Video uploaded' })
  @ApiParam({ name: 'id', description: 'Brand ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Brand video',
    type: FileUploadDto,
  })
  @ApiBearerAuth()
  @Post('/video/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('video', {
      storage: memoryStorage(),
      fileFilter: videoFilter,
      limits: { fileSize: 200 * 1024 * 1024 },
    }),
  )
  uploadVideo(
    @Param('id', ParseUUIDPipe) brandId: string,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.brandsService.uploadVideo(brandId, video);
  }

  @ApiParam({ name: 'brandId', description: 'Brand ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiBearerAuth()
  @Delete('/:brandId/video/:videoId')
  @UseGuards(AuthGuard)
  deleteVideo(
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Param('videoId', ParseUUIDPipe) videoId: string,
  ) {
    return this.brandsService.deleteVideo(videoId, brandId);
  }

  @ApiCreatedResponse({ type: CreateMediaDto, description: 'Catalog uploaded' })
  @ApiParam({ name: 'id', description: 'Brand ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Brand catalog',
    type: FileUploadDto,
  })
  @ApiBearerAuth()
  @Post('/catalog/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('catalog', {
      storage: memoryStorage(),
      fileFilter: catalogFilter,
      limits: { fileSize: 200 * 1024 * 1024 },
    }),
  )
  uploadCatalog(
    @Param('id', ParseUUIDPipe) brandId: string,
    @UploadedFile() catalog: Express.Multer.File,
  ) {
    return this.brandsService.uploadCatalog(brandId, catalog);
  }

  @ApiParam({ name: 'brandId', description: 'Brand ID' })
  @ApiParam({ name: 'catalogId', description: 'Catalog ID' })
  @ApiBearerAuth()
  @Delete('/:brandId/catalog/:catalogId')
  @UseGuards(AuthGuard)
  deleteCatalog(
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
  ) {
    return this.brandsService.deleteCatalog(brandId, catalogId);
  }

  @ApiParam({ name: 'brandId', description: 'Brand ID' })
  @ApiResponse({ description: 'Catalog downloaded successfully!' })
  @ApiBearerAuth()
  @Post('/download-catalog/:brandId')
  async downloadCatalog(
    @Param('brandId', ParseUUIDPipe) brandId: string,
    @Res() res: Response,
  ) {
    const catalog = await this.brandsService.downloadCatalog(brandId);
    res.redirect(catalog);
  }
}
