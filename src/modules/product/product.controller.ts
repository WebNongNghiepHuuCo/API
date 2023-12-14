import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Product } from './product.schema';
import { findPaginateProduct } from './dto/find-paginate-product.dto';
import { AppResponse } from '~/common/interfaces';
import { PaginationResponse } from '~/helpers';
import { Observable } from 'rxjs';
import { IdDto } from '~/common/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@ApiTags('[] - product')

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get paginate services',
  })
  @ApiOkResponse({ type: Product })
  findPaginateProducts(@Query() dto: findPaginateProduct): Promise<AppResponse<PaginationResponse<Product>>> {
    return this.productService.findPaginateProduct(dto);
  }
  
  @Get(':id')
  @ApiOperation({
    summary: 'Detail services',
  })
  findOne(@Param() id: IdDto): Promise<AppResponse<Product> | Observable<never>> {
    return this.productService.findOne(id.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update service',
  })
  update(
    @Param() id: IdDto,
    @Body() updateServicesDto: UpdateProductDto,
  ): Promise<AppResponse<Product | null> | Observable<never>> {
    return this.productService.update(id.id, updateServicesDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete service',
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
  
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/images/product',
      filename: (req, file, callback) => {
        const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`
        const [name, mineType] = file.originalname.split('.')
        const filename = `${name}_${uniqueSuffix}.${mineType}`
        callback(null, filename)
      }
    })
  }))
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
  async uploadFile(){
    return "success"
  }
}
