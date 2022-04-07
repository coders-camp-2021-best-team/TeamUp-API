import { IsEnum } from 'class-validator';

import { UserActivityStatus } from '../../user/entities/user-activity-status.enum';

export class UserStatusDto {
    @IsEnum(UserActivityStatus)
    activity_status: UserActivityStatus;
}
