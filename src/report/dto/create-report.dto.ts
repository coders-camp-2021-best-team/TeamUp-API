import { IsString, Length } from 'class-validator';

export class CreateReportDto {
    @IsString()
    @Length(5, 256)
    reason: string;
}
