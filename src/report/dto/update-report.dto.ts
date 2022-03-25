import { IsEnum, IsOptional } from 'class-validator';

import { UserReportStatus } from '../entities/user-report-status.enum';

export class UpdateReportDto {
    @IsOptional()
    @IsEnum(UserReportStatus)
    status?: UserReportStatus;
}
