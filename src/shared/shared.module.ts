import { Module } from '@nestjs/common';
import { TokenModule } from 'src/admin/token/token.module';
import { UserModule } from 'src/admin/user/user.module';
import { CatalogFileConverter } from 'src/helpers/pipes/catalogTransform.pipe';
import { ImageSharpFileConverter } from 'src/helpers/pipes/imageTransform.pipe';
import { VideoFileConverter } from 'src/helpers/pipes/videoTransform.pipe';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  imports: [MinioModule, TokenModule, UserModule],
  providers: [
    ImageSharpFileConverter,
    VideoFileConverter,
    CatalogFileConverter,
  ],
  exports: [
    MinioModule,
    TokenModule,
    UserModule,
    ImageSharpFileConverter,
    VideoFileConverter,
    CatalogFileConverter,
  ],
})
export class SharedModule {}
