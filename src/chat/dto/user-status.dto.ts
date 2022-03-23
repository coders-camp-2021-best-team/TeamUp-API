import { IsEnum } from 'class-validator';
import { UserActivityStatus } from '../../user';

export class UserStatusDto {
    @IsEnum(UserActivityStatus)
    activity_status: UserActivityStatus;
}
