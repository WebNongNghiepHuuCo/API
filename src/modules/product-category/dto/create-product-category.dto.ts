import { ApiProperty } from "@nestjs/swagger";

export class CreateProductCategoryDto {
    @ApiProperty()
    name: string;
}

