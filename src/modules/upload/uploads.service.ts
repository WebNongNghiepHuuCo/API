import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  public APP_URL = this.configService.get('APP_URL', 'http://127.0.0.1');

  public PORT = this.configService.get('APP_PORT', 3333);

  constructor(private configService: ConfigService) {}

  uploadVideo(file) {
    const path = `${file.destination}${file.filename}`;

    return {
      content: {
        path: path,
        fileName: file.filename,
        link: `${this.APP_URL}:${this.PORT}/${path}`,
      },
    };
  }
}
