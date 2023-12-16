import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, Req, UploadedFiles, ConsoleLogger } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { News } from './news.schema';
import { findPaginateNews } from './dto/find-paginate-news.dto';
import { AppResponse } from '~/common/interfaces';
import { PaginationResponse } from '~/helpers';
import { IdDto } from '~/common/dto';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('[] - news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get paginate services',
  })
  @ApiOkResponse({ type: News })
  findPaginateNews(@Query() dto: findPaginateNews): Promise<AppResponse<PaginationResponse<News>>> {
    return this.newsService.findPaginateNews(dto);
  }
  
  @Get(':id')
  @ApiOperation({
    summary: 'Detail services',
  })
  findOne(@Param() id: IdDto): Promise<AppResponse<News> | Observable<never>> {
    return this.newsService.findOne(id.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update service',
  })
  update(
    @Param() id: IdDto,
    @Body() updateServicesDto: UpdateNewsDto,
  ): Promise<AppResponse<News | null> | Observable<never>> {
    return this.newsService.update(id.id, updateServicesDto);
  }
  @Delete(':id')

  @ApiOperation({
    summary: 'Delete service',
  })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
  @Post('upload-img')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/images/news',
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
  uploadFile(@UploadedFiles() files) {
    return 1
  }
}
