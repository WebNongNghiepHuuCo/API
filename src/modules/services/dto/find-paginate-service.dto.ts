import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto';
import { EServiceType } from '~/constants';

export class FindPaginateService extends PaginationQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty({ required: false, enum: EServiceType })
  @IsString()
  @IsOptional()
  type?: string;
}
