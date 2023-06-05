import { Module } from '@nestjs/common';
import { FileController } from 'src/controllers/File.controller';
import { FileService } from 'src/services/Files.service';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
