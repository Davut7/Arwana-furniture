import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandsEntity } from './entities/brands.entity';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/crateBrands.dto';
import { UpdateBrandsDto } from './dto/updateBrands.dto';
import { MinioService } from 'src/minio/minio.service';
import { FileTypeEnum, MediaEntity } from 'src/helpers/entities/media.entity';
import { ImageSharpFileConverter } from 'src/helpers/pipes/imageTransform.pipe';
import { VideoFileConverter } from 'src/helpers/pipes/videoTransform.pipe';
import { CatalogFileConverter } from 'src/helpers/pipes/catalogTransform.pipe';
import { unlink } from 'fs/promises';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(BrandsEntity)
    private brandRepository: Repository<BrandsEntity>,
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    private imageTransformer: ImageSharpFileConverter,
    private videoTransformer: VideoFileConverter,
    private catalogTransformer: CatalogFileConverter,
    private minioService: MinioService,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) {}

  async createBrand(dto: CreateBrandDto) {
    await Promise.all([
      await this.checkDuplication(dto.enTitle, 'enTitle'),
      await this.checkDuplication(dto.tkmTitle, 'tkmTitle'),
      await this.checkDuplication(dto.ruTitle, 'ruTitle'),
    ]);

    const brand = this.brandRepository.create({
      ...dto,
    });

    await this.brandRepository.save(brand);

    return {
      message: 'Brand successfully created!',
      brand: brand,
    };
  }

  async findBrands() {
    const [brands, count] = await this.brandRepository
      .createQueryBuilder('brands')
      .leftJoinAndSelect('brands.medias', 'medias')
      .leftJoinAndSelect('brands.brandCategories', 'brandCategories')
      .leftJoinAndSelect('brandCategories.category', 'category')
      .leftJoinAndSelect('brandCategories.products', 'products')
      .leftJoinAndSelect('products.medias', 'productMedias')
      .leftJoinAndSelect('products.productOptions', 'productOptions')
      .leftJoinAndSelect('productOptions.medias', 'productOptionsMedias')
      .getManyAndCount();

    return {
      message: 'Brands returned successfully!',
      brands: brands,
      brandsCount: count,
    };
  }

  async findOneBrand(brandId: string) {
    const brand = await this.brandRepository
      .createQueryBuilder('brands')
      .leftJoinAndSelect('brands.medias', 'medias')
      .leftJoinAndSelect('brands.brandCategories', 'brandCategories')
      .leftJoinAndSelect('brandCategories.category', 'category')
      .leftJoinAndSelect('brandCategories.products', 'products')
      .leftJoinAndSelect('products.medias', 'productMedias')
      .leftJoinAndSelect('products.productOptions', 'productOptions')
      .leftJoinAndSelect('productOptions.medias', 'productOptionsMedias')
      .where('brands.id = :brandId', { brandId })
      .getOne();
    if (!brand) throw new NotFoundException('Brand not found!');

    return brand;
  }

  async updateBrand(brandId: string, dto: UpdateBrandsDto) {
    const brand = await this.findOneBrand(brandId);

    Object.assign(brand, dto);

    await this.brandRepository.save(brand);

    return {
      message: `Brand with id ${brandId} updated successfully`,
      brand: brand,
    };
  }

  async deleteBrand(brandId: string) {
    const brand = await this.findOneBrand(brandId);

    const fileNamesToDelete = brand.medias.map((media) => media.fileName);

    await this.minioService.deleteFiles(fileNamesToDelete);

    await this.brandRepository.delete(brand.id);

    return {
      message: `Brand with id ${brandId} deleted successfully`,
    };
  }

  async uploadImage(brandId: string, image: Express.Multer.File) {
    await this.findOneBrand(brandId);
    const transFormedImage = await this.imageTransformer.transform(image);

    const brandImage = this.mediaRepository.create({
      brand: { id: brandId },
      fileName: transFormedImage.fileName,
      filePath: transFormedImage.filePath,
      fileType: transFormedImage.fileType,
    });

    await this.mediaRepository.save(brandImage);

    return {
      message: 'Brand image uploaded successfully',
      brandImage: brandImage,
    };
  }

  async deleteImage(imageId: string, brandId: string) {
    await this.findOneBrand(brandId);
    const image = await this.mediaRepository.findOne({
      where: { id: imageId, brand: { id: brandId } },
    });
    if (!image)
      throw new NotFoundException(`Image with id ${imageId} not found!`);

    await this.minioService.deleteFile(image.fileName);

    await this.mediaRepository.delete(image.id);

    return {
      message: 'Brand image deleted successfully!',
    };
  }

  async uploadVideo(brandId: string, video: Express.Multer.File) {
    await this.findOneBrand(brandId);
    const transFormedVideo = await this.videoTransformer.transform(video);

    const brandVideo = this.mediaRepository.create({
      brand: { id: brandId },
      fileName: transFormedVideo.fileName,
      filePath: transFormedVideo.filePath,
      fileType: transFormedVideo.fileType,
    });

    await this.mediaRepository.save(brandVideo);

    return {
      message: 'Brand video uploaded successfully',
    };
  }

  async deleteVideo(videoId: string, brandId: string) {
    const video = await this.mediaRepository.findOne({
      where: { id: videoId, brand: { id: brandId } },
    });
    if (!video)
      throw new NotFoundException(`Video with id ${videoId} not found!`);

    await this.minioService.deleteFile(video.fileName);

    await this.mediaRepository.delete(video);

    return {
      message: 'Brand video deleted successfully!',
    };
  }

  async uploadCatalog(brandId: string, catalog: Express.Multer.File) {
    await this.findOneBrand(brandId);
    const isUnique = await this.mediaRepository.findOne({
      where: {
        brand: { id: brandId },
        fileType: FileTypeEnum.catalog,
      },
    });
    if (isUnique) {
      try {
        await unlink(catalog.path);
        return {
          message: `Brand with id ${brandId} already have catalog`,
        };
      } catch (err) {
        console.log(err);
      }
    }
    const transformedCatalog = await this.catalogTransformer.transform(catalog);
    const brandCatalog = this.mediaRepository.create({
      brand: { id: brandId },
      fileName: transformedCatalog.fileName,
      filePath: transformedCatalog.filePath,
      fileType: transformedCatalog.fileType,
    });

    await this.mediaRepository.save(brandCatalog);
    return {
      message: 'Catalog uploaded successfully!',
      brandCatalog: brandCatalog,
    };
  }

  async deleteCatalog(brandId: string, catalogId: string) {
    const catalog = await this.mediaRepository.findOne({
      where: { id: catalogId, brand: { id: brandId } },
    });
    if (!catalog)
      throw new NotFoundException(`Catalog with id ${catalogId} not found!`);

    await this.mediaRepository.delete(catalogId);

    await this.minioService.deleteFile(catalog.fileName);

    return {
      message: `Catalog with id ${catalogId} deleted successfully`,
    };
  }

  async downloadCatalog(brandId: string) {
    const catalog = await this.mediaRepository.findOne({
      where: { brand: { id: brandId }, fileType: FileTypeEnum.catalog },
    });
    if (!catalog)
      throw new NotFoundException(
        `Brand with id ${brandId} doesn't have catalog!`,
      );

    return catalog.filePath;
  }

  async checkDuplication(title: string, column: string) {
    const candidate = await this.brandRepository.findOne({
      where: { [column]: title },
    });

    if (candidate)
      throw new BadRequestException(`Brand with title ${title} already exists`);
  }
}
