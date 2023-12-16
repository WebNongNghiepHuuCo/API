import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [UploadController],
  providers: [UploadsService],
})
export class UploadModule {}
