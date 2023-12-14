import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsMongoId, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, isNotEmpty, maxLength } from "class-validator";
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty()
    @MaxLength(255, {
        message: 'Name must not be greater than 255 charecter',
    })
    @MinLength(1)
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string;

    @ApiProperty()
    @IsMongoId()
    categoryId: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    sortDesc: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    detail: string;
    
    @ApiProperty()
    @IsString() 
    thembnail: string;
}
