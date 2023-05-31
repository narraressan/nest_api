import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  async uploadToBucket(files: Array<Express.Multer.File>) {
    return [];
  }
}
