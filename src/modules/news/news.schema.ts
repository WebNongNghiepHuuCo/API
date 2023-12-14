import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSchema } from 'src/decorators';
import { BaseMongo } from 'src/common/dto';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';


export type NewsDocument = News & Document;

@BaseSchema()
export class News extends BaseMongo {
  @Prop({ required: true })
  @ApiProperty()
  name: string;
  
  @Prop({ required: true })
  @ApiProperty()
  alias: string;

  @Prop({ required: true })
  @ApiProperty()
  fulltext: string

  @Prop({ required: true })
  @ApiProperty()
  img: string
}

export const NewsSchema = SchemaFactory.createForClass(News);
NewsSchema.plugin(mongooseLeanVirtuals);
