import { Length, IsString, IsEnum } from 'class-validator';
import { UserReportStatus } from '.';

export class ReportDto {
    @IsString()
    @Length(5, 256)
    reason: string;

    @IsEnum(UserReportStatus)
    status: UserReportStatus;
}
