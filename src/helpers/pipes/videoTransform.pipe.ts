import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MinioService } from 'src/minio/minio.service';
import { FileTypeEnum } from '../entities/media.entity';
import { unlink } from 'fs/promises';
import * as ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import { ITransformedFile } from '../interfaces/fileTransform.interface';

@Injectable()
export class VideoFileConverter implements PipeTransform<Express.Multer.File> {
  constructor(private readonly minioService: MinioService) {}

  async transform(video: Express.Multer.File): Promise<ITransformedFile> {
    if (!video) throw new BadRequestException('Video path not provided');
    const convertedVideoPath = join(
      './uploads/videos',
      `${randomUUID()}-${video.originalname}`,
    );
    const uniqueFilename = `${randomUUID()}${video.originalname.slice(-4)}`;
    try {
      await this.formatVideo(video.path, convertedVideoPath);
      await this.minioService.uploadFile(
        uniqueFilename,
        video.path,
        video.mimetype,
      );
    } catch (err) {
      console.log(err, 'Error while processing and uploading video');
    } finally {
      await unlink(video.path);
      await unlink(convertedVideoPath);
    }

    const minioVideoPath = await this.minioService.getFileUrl(video.filename);
    const fileType = FileTypeEnum.video;

    return {
      fileName: process.env.MINIO_HOST + uniqueFilename,
      filePath: minioVideoPath,
      fileType,
    };
  }

  async formatVideo(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libx265')
        .audioCodec('aac')
        .audioBitrate(64)
        .fps(25)
        .on('end', () => resolve())
        .on('error', (error) => reject(error))
        .save(outputPath);
    });
  }
}
