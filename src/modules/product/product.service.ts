import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { AppResponse } from '~/common/interfaces';
import { Observable } from 'rxjs';
import { PaginationResponse, escapeRegex } from '~/helpers';
import PaginationHelper from '~/helpers/pagination.helper';
import { findPaginateProduct } from './dto/find-paginate-product.dto';
import { FindPaginateService } from '../services/dto';
import { ProductCategory } from '../product-category/product-category.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(ProductCategory.name) private productCategoryModel: Model<ProductCategory>,
  ) {}
  async create(createServiceDto: CreateProductDto): Promise<AppResponse<Product> | Observable<never>> {
    const { categoryId } = createServiceDto;
    const productCategory = await this.productCategoryModel.findOne({_id:categoryId});
    if(productCategory){
      return {
        content: await this.productModel.create({
          ...createServiceDto,
        }),
      };
    }else{
      throw new BadRequestException('productCategory not exist');
    }
   
  }

  async findPaginateProduct(dto: findPaginateProduct): Promise<AppResponse<PaginationResponse<Product>>> {
    const { page, perPage, match, skip } = PaginationHelper.getQueryByPagination<Product, FindPaginateService>(dto);

    const { keyword } = dto;

    if (keyword) {
      match.name = { $regex: new RegExp(escapeRegex(keyword), 'i') };
    }

    const [videos, count] = await Promise.all([
      this.productModel.find(match).sort({ createdAt: 'desc' }).limit(perPage).skip(skip),
      this.productModel.countDocuments(match),
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
  async findByField(filter: object): Promise<Product | Observable<never>> {
    const product = await this.productModel.findOne(filter);

    if (!product) {
      throw new BadRequestException('product not exist');
    }

    return product;
  }
  async update(id: string, updateProductDto: UpdateProductDto) {
    // const { name } = updateProductDto;
    const Product = await this.findByField({ _id: id });

    if (Product instanceof Observable) {
      return Product;
    }
    const data: any = {
      ...UpdateProductDto,
      name: name,
    };

    return {
      content: await this.productModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: data,
        },
        { new: true },
      ),
    };
  }
  async remove(id: string) {
    const product = await this.productModel.findOne({
      _id: id,
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return {
      content: await this.productModel.findByIdAndRemove({ _id: id }),
    };
  }
}
