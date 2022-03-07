import { Length, IsString, IsEnum } from 'class-validator';
import { UserReportStatus } from '.';

export class ReportDto {
    @IsString()
    @Length(5, 256)
    reason: string;
}
export class UpdateStatusDto {
    @IsEnum(UserReportStatus)
    status: UserReportStatus;
}
