import { IsEnum, IsOptional } from 'class-validator';
import { UserReportStatus } from '../entities';

export class GetReportsDto {
    @IsOptional()
    @IsEnum(UserReportStatus)
    status?: UserReportStatus;
}
