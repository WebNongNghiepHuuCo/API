import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSchema } from 'src/decorators';
import { BaseMongo } from 'src/common/dto';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';


export type ProductDocument = Product & Document;

@BaseSchema()
export class Product extends BaseMongo {
  @Prop({ required: true })
  @ApiProperty()
  name: string;
  @Prop({ required: true })
  @ApiProperty()
  categoryId: string;

  @Prop({ required: true })
  @ApiProperty()
  quantity: number;

  @Prop({ default: 0, required: true })
  @ApiProperty()
  price: number;

  @Prop({ default: 0 })
  @ApiProperty()
  discount: number;

  @Prop({ required: true })
  @ApiProperty()
  sortDesc: string;

  @Prop({ required: true })
  @ApiProperty()
  detail: string;

  @Prop({ required: true })
  @ApiProperty()
  thembnail: string
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(mongooseLeanVirtuals);
