import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateNewsDto {
    @ApiProperty()
    @MaxLength(255, {
        message: 'title must not be greater than 255 charecter',
    })
    @MinLength(1)
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    alias: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    fulltext: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    img: string;
}
