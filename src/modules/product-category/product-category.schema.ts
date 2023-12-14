import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSchema } from 'src/decorators';
import { BaseMongo } from 'src/common/dto';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';


export type ProductCategoryDocument = ProductCategory & Document;

@BaseSchema()
export class ProductCategory extends BaseMongo {
  @Prop({ required: true })
  @ApiProperty()
  name: string;
}

export const ProductCategorySchema = SchemaFactory.createForClass(ProductCategory);
ProductCategorySchema.plugin(mongooseLeanVirtuals);
