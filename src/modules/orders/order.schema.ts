import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSchema } from 'src/decorators';
import { BaseMongo } from 'src/common/dto';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { EOrderStatus } from '~/constants';
// import { ProductCheckoutOrder } from './dto';

export type OrderDocument = Order & Document;

@BaseSchema()
export class Order extends BaseMongo {
  @Prop({ required: true })
  @ApiProperty()
  userId: string;

  @Prop({ required: true })
  @ApiProperty()
  fullname: string;

  @Prop({ default: null })
  @ApiProperty()
  email: string;

  @Prop({ required: true })
  @ApiProperty()
  products: string[];
  
  @Prop({ default: EOrderStatus.PENDING })
  @ApiProperty({ enum: EOrderStatus, default: EOrderStatus.PENDING })
  status: EOrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.plugin(mongooseLeanVirtuals);
