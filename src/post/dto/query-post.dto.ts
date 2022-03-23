import { Type } from 'class-transformer';
import {
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Length,
    Max,
    Min
} from 'class-validator';
export class QueryPostDto {
    @IsOptional()
    @IsString()
    @Length(3, 32)
    q?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(120)
    take = 20;

    @Type(() => Number)
    @IsInt()
    skip = 0;

    @IsString()
    @IsIn(['ASC', 'DESC'])
    sort: 'ASC' | 'DESC' = 'DESC';
}
