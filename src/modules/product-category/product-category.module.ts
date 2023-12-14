import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductCategory, ProductCategorySchema } from './product-category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductCategory.name, schema: ProductCategorySchema }])],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
})
export class ProductCategoryModule {}
