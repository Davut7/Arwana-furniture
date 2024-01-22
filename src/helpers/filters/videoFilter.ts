import { UnsupportedMediaTypeException } from '@nestjs/common';

type validFileExtension = 'mp4' | 'avi' | 'mkv' | 'mov' | 'wmv';
type validMimeType =
  | 'video/mp4'
  | 'video/x-msvideo'
  | 'video/x-matroska'
  | 'video/quicktime'
  | 'video/x-ms-wmv';

const validMimeTypes: validMimeType[] = [
  'video/mp4',
  'video/x-msvideo',
  'video/x-matroska',
  'video/quicktime',
  'video/x-ms-wmv',
];

const validFileExtensions: validFileExtension[] = [
  'mp4',
  'avi',
  'mkv',
  'mov',
  'wmv',
];

export function videoFilter(req, file, cb) {
  const fileExtension =
    file.originalname.split('.')[file.originalname.split('.').length - 1];

  if (!validFileExtensions.includes(fileExtension.toLowerCase())) {
    cb(new UnsupportedMediaTypeException('Invalid file extension.'), false);
    return;
  }

  if (!validMimeTypes.includes(file.mimetype)) {
    cb(new UnsupportedMediaTypeException('Invalid mime type.'), false);
    return;
  }

  cb(null, true);
}
