import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MinioService } from 'src/minio/minio.service';
import { FileTypeEnum } from '../entities/media.entity';
import { ITransformedFile } from '../interfaces/fileTransform.interface';

@Injectable()
export class VideoFileConverter implements PipeTransform<Express.Multer.File> {
  constructor(private readonly minioService: MinioService) {}

  async transform(video: Express.Multer.File): Promise<ITransformedFile> {
    if (!video) throw new BadRequestException('Video path not provided');
    const mimeType = video.mimetype.split('/')[1];
    const videoName = video.fieldname + randomUUID() + `.${mimeType}`;
      await this.minioService.uploadObject(
        videoName,
        video.buffer,
        video.buffer.byteLength,
      );

    const minioVideoPath = await this.minioService.getFileUrl(video.filename);
    const fileType = FileTypeEnum.video;

    return {
      fileName: videoName,
      filePath: minioVideoPath,
      fileType,
    };
  }
}
