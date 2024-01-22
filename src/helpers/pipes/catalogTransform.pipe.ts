import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { FileTypeEnum } from '../entities/media.entity';
import { unlink } from 'fs/promises';
import { ITransformedFile } from '../interfaces/fileTransform.interface';

@Injectable()
export class CatalogFileConverter
  implements PipeTransform<Express.Multer.File>
{
  constructor(private readonly minioService: MinioService) {}

  async transform(catalog: Express.Multer.File): Promise<ITransformedFile> {
    if (!catalog) throw new BadRequestException('Catalog path not provided');
    try {
      await this.minioService.uploadFile(
        catalog.filename,
        catalog.path,
        catalog.mimetype,
      );
      await unlink(catalog.path);
    } catch (err) {
      console.log(err, 'Error while processing and uploading catalog');
    }
    const minioCatalogPath = await this.minioService.getFileUrl(
      catalog.filename,
    );
    const fileType = FileTypeEnum.catalog;

    return {
      fileName: process.env.MINIO_HOST + catalog.filename,
      filePath: minioCatalogPath,
      fileType,
    };
  }
}
