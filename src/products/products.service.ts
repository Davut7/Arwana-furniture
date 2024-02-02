import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { MediaEntity } from 'src/helpers/entities/media.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProducts.dto';
import { ImageSharpFileConverter } from 'src/helpers/pipes/imageTransform.pipe';
import { VideoFileConverter } from 'src/helpers/pipes/videoTransform.pipe';
import { MinioService } from 'src/minio/minio.service';
import { BrandCategoryService } from 'src/brand-category/brand-category.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    private imageFileTransformer: ImageSharpFileConverter,
    private videoFileTransformer: VideoFileConverter,
    private minioService: MinioService,
    private brandCategoryService: BrandCategoryService,
  ) {}

  async createProduct(dto: CreateProductDto, brandCategoryId: string) {
    await Promise.all([
      await this.checkDuplication(dto.tkmTitle, 'tkmTitle'),
      await this.checkDuplication(dto.ruTitle, 'ruTitle'),
      await this.checkDuplication(dto.enTitle, 'enTitle'),
    ]);
    await this.brandCategoryService.findCategoryBrandById(brandCategoryId);
    const product = this.productRepository.create({
      ...dto,
      categoryBrand: { id: brandCategoryId },
    });
    await this.productRepository.save(product);

    return {
      message: 'Product created successfully!',
      product: product,
    };
  }

  async findAllProducts() {
    const [products, count] = await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.medias', 'medias')
      .leftJoinAndSelect('products.categoryBrand', 'categoryBrand')
      .leftJoinAndSelect('categoryBrand.category', 'category')
      .leftJoinAndSelect('categoryBrand.brand', 'brand')
      .leftJoinAndSelect('products.productOptions', 'productOptions')
      .leftJoinAndSelect('productOptions.medias', 'productOptionsMedias')
      .getManyAndCount();

    return {
      message: 'Product returned successfully!',
      products: products,
      productCount: count,
    };
  }

  async findOneProduct(productId: string) {
    const product = await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.medias', 'medias')
      .leftJoinAndSelect('products.categoryBrand', 'categoryBrand')
      .leftJoinAndSelect('categoryBrand.category', 'category')
      .leftJoinAndSelect('categoryBrand.brand', 'brand')
      .leftJoinAndSelect('products.productOptions', 'productOptions')
      .leftJoinAndSelect('productOptions.medias', 'productOptionsMedias')
      .where('products.id = :productId', { productId })
      .getOne();
    if (!product)
      throw new NotFoundException(`Product with id ${productId} not found!`);
    return product;
  }

  async updateProduct(productId: string, dto: UpdateProductDto) {
    const product = await this.findOneProduct(productId);

    Object.assign(product, dto);
    await this.productRepository.save(product);

    return {
      message: `Product with id ${productId} updated successfully!`,
      product: product,
    };
  }

  async deleteProduct(productId: string) {
    const product = await this.findOneProduct(productId);

    const fileNames = product.medias.map((media) => media.fileName);

    await this.productRepository.delete(product.id);

    await this.minioService.deleteFiles(fileNames);

    return {
      message: `Product with id ${productId} deleted successfully!`,
    };
  }

  async uploadImage(productId: string, image: Express.Multer.File) {
    await this.findOneProduct(productId);
    const transformedFile = await this.imageFileTransformer.transform(image);

    const productImage = this.mediaRepository.create({
      product: { id: productId },
      fileName: transformedFile.fileName,
      filePath: transformedFile.filePath,
      fileType: transformedFile.fileType,
    });

    await this.mediaRepository.save(productImage);

    return {
      message: 'Image uploaded successfully!',
    };
  }

  async deleteImage(productId: string, fileId: string) {
    const image = await this.mediaRepository.findOne({
      where: { id: fileId, product: { id: productId } },
    });
    if (!image) throw new NotFoundException('Image not found!');

    await this.minioService.deleteFile(image.fileName);

    await this.mediaRepository.delete(fileId);

    return {
      message: 'Image deleted successfully!',
    };
  }

  async uploadVideo(productId: string, video: Express.Multer.File) {
    await this.findOneProduct(productId);
    const transformedFile = await this.videoFileTransformer.transform(video);
    const productImage = this.mediaRepository.create({
      product: { id: productId },
      fileName: transformedFile.fileName,
      filePath: transformedFile.filePath,
      fileType: transformedFile.fileType,
    });

    await this.mediaRepository.save(productImage);

    return {
      message: 'Product uploaded successfully!',
    };
  }

  async deleteVideo(productId: string, fileId: string) {
    const image = await this.mediaRepository.findOne({
      where: { id: fileId, product: { id: productId } },
    });

    if (!image) throw new NotFoundException('Product not found!');

    await this.minioService.deleteFile(image.fileName);

    await this.mediaRepository.delete(fileId);

    return {
      message: 'Product deleted successfully!',
    };
  }

  async checkDuplication(columnValue: string, columnName: string) {
    const product = await this.productRepository.findOne({
      where: { [columnName]: columnValue },
    });

    if (product)
      throw new ConflictException(
        `Product with title ${columnName}  already exists!`,
      );
    return product;
  }
}
