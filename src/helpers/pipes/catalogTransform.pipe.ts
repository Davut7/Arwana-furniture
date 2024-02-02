import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { FileTypeEnum } from '../entities/media.entity';
import { ITransformedFile } from '../interfaces/fileTransform.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class CatalogFileConverter
  implements PipeTransform<Express.Multer.File>
{
  constructor(private readonly minioService: MinioService) {}

  async transform(catalog: Express.Multer.File): Promise<ITransformedFile> {
    if (!catalog) throw new BadRequestException('Catalog path not provided');
    const mimeType = catalog.mimetype.split('/')[1];
    const catalogName = catalog.fieldname + randomUUID() + `.${mimeType}`;
    await this.minioService.uploadObject(
      catalogName,
      catalog.buffer,
      catalog.buffer.byteLength,
    );
    const minioCatalogPath = await this.minioService.getFileUrl(
      catalog.filename,
    );

    const fileType = FileTypeEnum.catalog;

    return {
      fileName: catalogName,
      filePath: minioCatalogPath,
      fileType,
    };
  }
}
