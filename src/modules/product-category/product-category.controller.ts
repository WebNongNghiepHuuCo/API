import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { AppResponse } from '~/common/interfaces';
import { ProductCategory } from './product-category.schema';
import { Observable } from 'rxjs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { findPaginateProductCategory } from './dto/find-paginate-product-category.dto';
import { PaginationResponse } from '~/helpers';
import { IdDto } from '~/common/dto';

@ApiTags('[] - product-category')

@Controller('product-category')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Post()
  create(@Body()CreateProductCategoryDto:CreateProductCategoryDto): Promise<AppResponse<ProductCategory> | Observable<never>> {
    return this.productCategoryService.create(CreateProductCategoryDto);
  }
  @Get()
  @ApiOperation({
    summary: 'Get paginate services',
  })
  @ApiOkResponse({ type: ProductCategory })
  findPaginateProducts(@Query() dto: findPaginateProductCategory): Promise<AppResponse<PaginationResponse<ProductCategory>>> {
    return this.productCategoryService.findPaginateProductCategory(dto);
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Detail services',
  })
  findOne(@Param() id: IdDto): Promise<AppResponse<ProductCategory> | Observable<never>> {
    return this.productCategoryService.findOne(id.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update service',
  })
  update(
    @Param() id: IdDto,
    @Body() updateServicesDto: UpdateProductCategoryDto,
  ): Promise<AppResponse<ProductCategory | null> | Observable<never>> {
    return this.productCategoryService.update(id.id, updateServicesDto);
  }
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete service',
  })
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(id);
  }
}
