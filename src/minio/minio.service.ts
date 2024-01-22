import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;
  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });

    this.bucketName = process.env.MINIO_BUCKET_NAME;
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'arwana');
      const publicPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };
      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(publicPolicy),
      );
    }
  }

  async uploadImageFile(fileName: string, buffer: Buffer, size: number) {
    const file = await this.minioClient.putObject(
      this.bucketName,
      fileName,
      buffer,
      size,
    );
    return file;
  }

  async uploadFile(fileName: string, filePath: string, mimeType: string) {
    const file = await this.minioClient.fPutObject(
      this.bucketName,
      fileName,
      filePath,
      {
        'Content-Type': mimeType,
      },
    );
    return file;
  }

  async getFileUrl(fileName: string) {
    const url = await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
    );
    return url.replace(
      this.configService.get('MINIO_HOST'),
      process.env.MINIO_HOST,
    );
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }

  async deleteFiles(fileName: string[]) {
    this.minioClient.removeObjects(this.bucketName, fileName, (err) => {
      if (err) {
        console.error('Error deleting objects:', err);
      }
    });
  }
}
