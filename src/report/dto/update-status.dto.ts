import { IsEnum } from 'class-validator';
import { UserReportStatus } from '..';

export class UpdateStatusDto {
    @IsEnum(UserReportStatus)
    status: UserReportStatus;
}
