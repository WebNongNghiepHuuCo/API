import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';
import { UploadsService } from './uploads.service';

@ApiTags('[] - upload file')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/images/product',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
          const [name, mineType] = file.originalname.split('.');
          const filename = `${name}_${uniqueSuffix}.${mineType}`;
          callback(null, filename);
        },
      }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload file',
    tags: ['upload-file'],
  })
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadVideo(file);
  }
}
