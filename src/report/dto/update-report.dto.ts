import { IsEnum, IsOptional } from 'class-validator';
import { UserReportStatus } from '..';

export class UpdateReportDto {
    @IsOptional()
    @IsEnum(UserReportStatus)
    status?: UserReportStatus;
}
