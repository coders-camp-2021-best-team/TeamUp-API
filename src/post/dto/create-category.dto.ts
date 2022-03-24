import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @Length(5, 128)
    name: string;
}
