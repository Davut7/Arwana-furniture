import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoryEntity } from './entities/category.entity';
import { MediaEntity } from 'src/helpers/entities/media.entity';
import { ImageSharpFileConverter } from 'src/helpers/pipes/imageTransform.pipe';
import { VideoFileConverter } from 'src/helpers/pipes/videoTransform.pipe';
import { MinioService } from 'src/minio/minio.service';
import { BrandsService } from 'src/brands/brands.service';
import { CategoryBrandEntity } from 'src/brand-category/entities/brandCategory.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    @InjectRepository(CategoryBrandEntity)
    private categoryBrandRepository: Repository<CategoryBrandEntity>,
    private imageFileTransformer: ImageSharpFileConverter,
    private videoFileTransformer: VideoFileConverter,
    private minioService: MinioService,
    @Inject(forwardRef(() => BrandsService))
    private brandService: BrandsService,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    await Promise.all([
      await this.checkDuplicateTitle(createCategoryDto.tkmTitle, 'tkmTitle'),
      await this.checkDuplicateTitle(createCategoryDto.ruTitle, 'ruTitle'),
      await this.checkDuplicateTitle(createCategoryDto.enTitle, 'enTitle'),
    ]);
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);
    return {
      message: 'Category created successfully!',
      category: category,
    };
  }

  async findCategories() {
    const [categories, count] = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.medias', 'categoryMedia')
      .leftJoinAndSelect('category.categoryBrands', 'categoryBrands')
      .leftJoinAndSelect('categoryBrands.brand', 'brand')
      .leftJoinAndSelect('categoryBrands.products', 'products')
      .leftJoinAndSelect('products.medias', 'medias')
      .leftJoinAndSelect('products.productOptions', 'productOptions')
      .leftJoinAndSelect('productOptions.medias', 'productOptionsMedias')
      .getManyAndCount();
    return {
      messages: 'Categories returned successfully!',
      categories: categories,
      categoriesCount: count,
    };
  }

  async findOneCategory(categoryId: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.medias', 'categoryMedia')
      .leftJoinAndSelect('category.categoryBrands', 'categoryBrands')
      .leftJoinAndSelect('categoryBrands.brand', 'brand')
      .leftJoinAndSelect('categoryBrands.products', 'products')
      .leftJoinAndSelect('products.medias', 'productMedia')
      .leftJoinAndSelect('products.productOptions', 'productOptions')
      .leftJoinAndSelect('productOptions.medias', 'productOptionsMedias')
      .where('category.id = :categoryId', { categoryId })
      .getOne();

    if (!category)
      throw new NotFoundException(`Category with id ${categoryId} not found`);

    return category;
  }

  async deleteCategory(categoryId: string) {
    const category = await this.findOneCategory(categoryId);
    if (!category) throw new NotFoundException('Category not found!');

    const fileNamesToDelete = category.medias.map((media) => media.fileName);

    const categoryBrands = await this.categoryBrandRepository.find({
      where: { category: category },
    });

    for (const categoryBrand of categoryBrands) {
      await this.brandService.deleteBrand(categoryBrand.brand.id);
      await this.categoryBrandRepository.remove(categoryBrand);
    }

    await this.minioService.deleteFiles(fileNamesToDelete);

    await this.categoryRepository.delete(category.id);

    return {
      message: `Category with id ${categoryId} deleted successfully!`,
    };
  }

  async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.findOneCategory(categoryId);

    Object.assign(category, updateCategoryDto);

    await this.categoryRepository.save(category);

    return {
      message: `Category with id ${categoryId} updated successfully!`,
      category: category,
    };
  }

  async checkDuplicateTitle(title: string, columnName: string) {
    const category = await this.categoryRepository.findOne({
      where: { [columnName]: title },
    });
    if (category)
      throw new ConflictException(
        `Category with title ${title} already exists`,
      );
  }

  async uploadImage(categoryId: string, image: Express.Multer.File) {
    await this.findOneCategory(categoryId);
    const transformedFile = await this.imageFileTransformer.transform(image);

    const categoryImage = this.mediaRepository.create({
      category: { id: categoryId },
      fileName: transformedFile.fileName,
      filePath: transformedFile.filePath,
      fileType: transformedFile.fileType,
    });

    await this.mediaRepository.save(categoryImage);

    return {
      message: 'Image uploaded successfully!',
    };
  }

  async deleteImage(categoryId: string, fileId: string) {
    const image = await this.mediaRepository.findOne({
      where: { id: fileId, category: { id: categoryId } },
    });
    if (!image) throw new NotFoundException('Image not found!');

    await this.minioService.deleteFile(image.fileName);

    await this.mediaRepository.delete(fileId);

    return {
      message: 'Image deleted successfully!',
    };
  }

  async uploadVideo(categoryId: string, video: Express.Multer.File) {
    await this.findOneCategory(categoryId);
    const transformedFile = await this.videoFileTransformer.transform(video);
    const categoryImage = this.mediaRepository.create({
      category: { id: categoryId },
      fileName: transformedFile.fileName,
      filePath: transformedFile.filePath,
      fileType: transformedFile.fileType,
    });

    await this.mediaRepository.save(categoryImage);

    return {
      message: 'Video uploaded successfully!',
    };
  }

  async deleteVideo(categoryId: string, fileId: string) {
    const image = await this.mediaRepository.findOne({
      where: { id: fileId, category: { id: categoryId } },
    });

    if (!image) throw new NotFoundException('Video not found!');

    await this.minioService.deleteFile(image.fileName);

    await this.mediaRepository.delete(fileId);

    return {
      message: 'Video deleted successfully!',
    };
  }
}
