import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Max, Min } from 'class-validator';

export class SearchQueryDto {
    @IsString()
    @Length(3, 32)
    q: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(120)
    take = 20;

    @Type(() => Number)
    @IsInt()
    skip = 0;
}
