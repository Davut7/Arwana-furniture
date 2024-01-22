import { UnsupportedMediaTypeException } from '@nestjs/common';

type validFileExtension = 'pdf';
type validMimeType = 'application/pdf';

const validMimeTypes: validMimeType[] = ['application/pdf'];
const validFileExtensions: validFileExtension[] = ['pdf'];

export function catalogFilter(req, file, cb) {
  if (
    !validFileExtensions.includes(
      file.originalname.split('.')[file.originalname.split('.').length - 1],
    )
  ) {
    cb(new UnsupportedMediaTypeException('Invalid file extension.'), false);
    return;
  }
  if (!validMimeTypes.includes(file.mimetype)) {
    cb(new UnsupportedMediaTypeException('Invalid mime type.'), false);
    return;
  }

  cb(null, true);
}
