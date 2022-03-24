import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @Length(5, 128)
    name?: string;
}
