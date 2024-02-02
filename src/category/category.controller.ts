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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { imageFilter } from 'src/helpers/filters/imageFilter';
import { videoFilter } from 'src/helpers/filters/videoFilter';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/admin/guards/auth.guard';
import { CategoryEntity } from './entities/category.entity';
import { FileUploadDto } from '../helpers/swagger/fileUpload.dto';
import { CreateMediaDto } from 'src/helpers/swagger/mediaEntity.dto';

@ApiTags('category')
@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateCategoryDto,
    description: 'Created category data',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Data to create category',
    required: true,
  })
  @ApiConflictResponse({
    description: 'Category with this data already exists',
  })
  @Post()
  @UseGuards(AuthGuard)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @ApiOkResponse({ type: CategoryEntity, description: 'Find all categories' })
  @Get()
  findCategories() {
    return this.categoryService.findCategories();
  }

  @ApiOkResponse({ type: CategoryEntity, description: 'Find one categories' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @Get(':id')
  findOneCategory(@Param('id', ParseUUIDPipe) categoryId: string) {
    return this.categoryService.findOneCategory(categoryId);
  }

  @ApiCreatedResponse({ type: CategoryEntity, description: 'Update category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto, description: 'Body to update category' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard)
  updateCategory(
    @Param('id', ParseUUIDPipe) categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(categoryId, updateCategoryDto);
  }

  @ApiOkResponse()
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteCategory(@Param('id', ParseUUIDPipe) categoryId: string) {
    return this.categoryService.deleteCategory(categoryId);
  }

  @ApiCreatedResponse({
    type: CreateMediaDto,
    description: 'Image uploaded successfully',
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image',
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
        fileSize: 25 * 1024 * 1024,
      },
    }),
  )
  uploadImage(
    @Param('id', ParseUUIDPipe) categoryId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.categoryService.uploadImage(categoryId, image);
  }

  @ApiOkResponse()
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiBearerAuth()
  @Delete('/:categoryId/image/:imageId')
  @UseGuards(AuthGuard)
  deleteImage(
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    return this.categoryService.deleteImage(categoryId, imageId);
  }

  @ApiCreatedResponse({ type: CreateMediaDto })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    description: 'Video',
    type: FileUploadDto,
  })
  @Post('/video/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('video', {
      storage: memoryStorage(),
      fileFilter: videoFilter,
      limits: {
        fileSize: 200 * 1024 * 1024,
      },
    }),
  )
  uploadVideo(
    @Param('id', ParseUUIDPipe) categoryId: string,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.categoryService.uploadVideo(categoryId, video);
  }

  @ApiOkResponse()
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  @ApiBearerAuth()
  @Delete('/:categoryId/video/:videoId')
  @UseGuards(AuthGuard)
  deleteVideo(
    @Param('videoId', ParseUUIDPipe) videoId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    return this.categoryService.deleteVideo(categoryId, videoId);
  }
}
