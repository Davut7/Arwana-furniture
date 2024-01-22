import { FileTypeEnum } from '../entities/media.entity';

export interface ITransformedFile {
  fileName: string;
  filePath: string;
  fileType: FileTypeEnum;
}
