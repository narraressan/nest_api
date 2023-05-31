import { Module } from '@nestjs/common';
import { FileController } from 'src/controllers/File.controller';
import { FileService } from 'src/services/Files.service';

@Module({
  controllers: [FileController],
  imports: [],
  providers: [FileService],
})
export class FileModule {}
