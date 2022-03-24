import { IsEnum } from 'class-validator';

// FIXME: circular dependency from '../../user'
enum UserActivityStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE'
}

export class UserStatusDto {
    @IsEnum(UserActivityStatus)
    activity_status: UserActivityStatus;
}
