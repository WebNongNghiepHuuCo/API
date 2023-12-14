import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { ProductCategory, ProductCategorySchema } from '../product-category/product-category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }, {name: ProductCategory.name, schema: ProductCategorySchema} ])],
  
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
