import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/db/entities/Base';
import { UploadedFileDto } from 'src/dto/File.dto';
import { IsPrivateApi } from 'src/guards/Auth.guard';
import { UserRoles, UserRolesGuard } from 'src/guards/Roles.guard';
import { FileService } from 'src/services/Files.service';

@ApiTags('File')
@ApiBearerAuth()
@UserRoles(UserRoleEnum.ADMIN, UserRoleEnum.MANAGEMENT)
@UseGuards(IsPrivateApi, UserRolesGuard)
@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<UploadedFileDto[]> {
    return await this.fileService.uploadToBucket(files);
  }
}
