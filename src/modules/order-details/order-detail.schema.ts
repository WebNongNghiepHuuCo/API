import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { BaseMongo } from "~/common/dto";
import { EOrderDetailStatus } from "~/constants/orderdetail.constant";
import { BaseSchema } from "~/decorators";


export type OrderDetailDocument = OrderDetail & Document;

@BaseSchema()
export class OrderDetail extends BaseMongo {

  @ApiProperty()
  @IsMongoId({ message: 'ID is not match' })
  @IsNotEmpty({ message: 'ID is required' })
  orderId: string;

  @ApiProperty()
  @IsMongoId({ message: 'ID is not match' })
  @IsNotEmpty({ message: 'ID is required' })
  productId: string;

  // @Prop({ required: true })
  // @ApiProperty()
  // quantity: number;

  // @Prop({ default: 0, required: true })
  // @ApiProperty()
  // price: number;

  // @Prop({ default: 0 })
  // @ApiProperty()
  // discount: number;
  
  @Prop({ default: EOrderDetailStatus.PENDING })
  @ApiProperty({ enum: EOrderDetailStatus, default: EOrderDetailStatus.PENDING })
  status: EOrderDetailStatus;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
OrderDetailSchema.plugin(mongooseLeanVirtuals);
