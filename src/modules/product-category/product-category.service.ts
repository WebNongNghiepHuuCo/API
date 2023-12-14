import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductCategory } from './product-category.schema';
import { AppResponse } from '~/common/interfaces';
import { PaginationResponse, escapeRegex } from '~/helpers';
import { findPaginateProductCategory } from './dto/find-paginate-product-category.dto';
import { FindPaginateService } from '../services/dto';
import PaginationHelper from '~/helpers/pagination.helper';
import { Observable } from 'rxjs';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(@InjectModel(ProductCategory.name) private productCategoryModel: Model<ProductCategory>) {}
  async create(createServiceDto: CreateProductCategoryDto): Promise<AppResponse<ProductCategory> | Observable<never>> {
    return {
      content: await this.productCategoryModel.create({
        ...createServiceDto,
      }),
    };
  }
  async findPaginateProductCategory(
    dto: findPaginateProductCategory,
  ): Promise<AppResponse<PaginationResponse<ProductCategory>>> {
    const { page, perPage, match, skip } = PaginationHelper.getQueryByPagination<ProductCategory, FindPaginateService>(
      dto,
    );

    const { keyword } = dto;

    if (keyword) {
      match.email = { $regex: new RegExp(escapeRegex(keyword), 'i') };
    }

    const [videos, count] = await Promise.all([
      this.productCategoryModel.find(match).sort({ createdAt: 'desc' }).limit(perPage).skip(skip),
      this.productCategoryModel.countDocuments(match),
    ]);
    return {
      content: PaginationHelper.getPaginationResponse({ page: page, data: videos, perPage: perPage, total: count }),
    };
  }
  async findOne(id: string) {
    const product = await this.findByField({ _id: id });

    if (product instanceof Observable) {
      return product;
    }

    return {
      content: product,
    };
  }
  async findByField(filter: object): Promise<ProductCategory | Observable<never>> {
    const product = await this.productCategoryModel.findOne(filter);

    if (!product) {
      throw new BadRequestException('product not exist');
    }

    return product;
  }
  async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
    const { name } = updateProductCategoryDto;
    const ProductCategory = await this.findByField({ _id: id });

    if (ProductCategory instanceof Observable) {
      return ProductCategory;
    }
    const data: any = {
      ...UpdateProductCategoryDto,
      name: name,
    };

    return {
      content: await this.productCategoryModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: data,
        },
        { new: true },
      ),
    };
  }
  async remove(id: string) {
    const product = await this.productCategoryModel.findOne({
      _id: id,
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return {
      content: await this.productCategoryModel.findByIdAndRemove({ _id: id }),
    };
  }
}
