import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationQueryDto } from "~/common/dto";

export class findPaginateCategory extends PaginationQueryDto {
    @ApiProperty({
      required: false,
    })
    @IsString()
    @IsOptional()
    categoryName?: string;
  }