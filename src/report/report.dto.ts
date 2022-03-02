import { Length, IsString, IsEnum } from 'class-validator';

export enum UserReportStatus {
    PENDING = 'PENDING',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED'
}
export class ReportDto {
    @IsString()
    @Length(5, 256)
    reason: string;

    @IsEnum(UserReportStatus)
    status: UserReportStatus;
}
