import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOptionsEntity } from './entities/productOptions.entity';
import { Repository } from 'typeorm';
import { CreateProductOptionsDto } from './dto/createProductOptions.dto';
import { UpdateProductOptionsDto } from './dto/updateProductOptions.dto';
import { ProductsService } from 'src/products/products.service';
import { MinioService } from 'src/minio/minio.service';
import { ImageSharpFileConverter } from 'src/helpers/pipes/imageTransform.pipe';
import { MediaEntity } from 'src/helpers/entities/media.entity';

@Injectable()
export class ProductOptionsService {
  constructor(
    @InjectRepository(ProductOptionsEntity)
    private productOptionsRepository: Repository<ProductOptionsEntity>,
    private productService: ProductsService,
    private minioService: MinioService,
    private imageFileTransformer: ImageSharpFileConverter,
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
  ) {}

  async createProductOptions(productId: string, dto: CreateProductOptionsDto) {
    await this.productService.findOneProduct(productId);

    await Promise.all([
      await this.checkExistingOption(dto.enTitle, 'enTitle'),
      await this.checkExistingOption(dto.ruTitle, 'ruTitle'),
      await this.checkExistingOption(dto.tkmTitle, 'tkmTitle'),
    ]);

    const productOptions = this.productOptionsRepository.create({
      product: { id: productId },
      ...dto,
    });

    await this.productOptionsRepository.save(productOptions);

    return {
      message: 'Product options created successfully!',
      productOptions: productOptions,
    };
  }

  async deleteProductOptions(productOptionId: string) {
    const productOptions = await this.productOptionsRepository.findOne({
      where: { id: productOptionId },
    });

    if (!productOptions)
      throw new NotFoundException('Product options not found!');

    await this.productOptionsRepository.delete(productOptions.id);

    return {
      message: 'Product options deleted successfully',
    };
  }

  async updateProductOptions(
    productOptionId: string,
    dto: UpdateProductOptionsDto,
  ) {
    const productOptions = await this.productOptionsRepository.findOne({
      where: { id: productOptionId },
    });

    if (!productOptions)
      throw new NotFoundException('Product options not found!');

    Object.assign(productOptions, dto);

    await this.productOptionsRepository.save(productOptions);

    return {
      message: 'Product option updated successfully',
      productOptions: productOptions,
    };
  }

  async findProductOptionsById(productOptionsId: string) {
    const productOptions = await this.productOptionsRepository.findOne({
      where: { id: productOptionsId },
    });

    if (!productOptions)
      throw new NotFoundException('Product options not found!');

    return productOptions;
  }

  async uploadImage(productOptionsId: string, image: Express.Multer.File) {
    await this.findProductOptionsById(productOptionsId);
    const transformedFile = await this.imageFileTransformer.transform(image);

    const productImage = this.mediaRepository.create({
      productOption: { id: productOptionsId },
      fileName: transformedFile.fileName,
      filePath: transformedFile.filePath,
      fileType: transformedFile.fileType,
    });

    await this.mediaRepository.save(productImage);

    return {
      message: 'Image uploaded successfully!',
    };
  }

  async deleteImage(productOptionsId: string, fileId: string) {
    const image = await this.mediaRepository.findOne({
      where: { id: fileId, productOption: { id: productOptionsId } },
    });
    if (!image) throw new NotFoundException('Image not found!');

    await this.minioService.deleteFile(image.fileName);

    await this.mediaRepository.delete(fileId);

    return {
      message: 'Image deleted successfully!',
    };
  }

  async checkExistingOption(title: string, titleLang: string) {
    const options = await this.productOptionsRepository.findOne({
      where: { [titleLang]: title },
    });
    if (options)
      throw new ConflictException(`Title in lang ${titleLang} already exists`);
  }
}
