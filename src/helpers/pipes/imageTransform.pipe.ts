import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as sharp from 'sharp';
import { MinioService } from 'src/minio/minio.service';
import { FileTypeEnum } from '../entities/media.entity';
import { ITransformedFile } from '../interfaces/fileTransform.interface';

@Injectable()
export class ImageSharpFileConverter
  implements PipeTransform<Express.Multer.File>
{
  constructor(private readonly minioService: MinioService) {}

  async transform(image: Express.Multer.File): Promise<ITransformedFile> {
    if (!image) throw new BadRequestException('Image not provided');
    const imageName = image.fieldname + randomUUID() + '.webp';

    const transformedBuffer = await sharp(image.buffer)
      .jpeg({ quality: 80 })
      .png({ quality: 80 })
      .toFormat('webp')
      .toBuffer();

    await this.minioService.uploadImageFile(
      imageName,
      transformedBuffer,
      transformedBuffer.buffer.byteLength,
    );
    const imagePath = await this.minioService.getFileUrl(imageName);
    const fileType = FileTypeEnum.image;
    return {
      fileName: process.env.MINIO_HOST + imageName,
      filePath: imagePath,
      fileType,
    };
  }
}
