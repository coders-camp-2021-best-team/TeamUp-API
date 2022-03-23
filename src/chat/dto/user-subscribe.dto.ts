import { IsUUID } from 'class-validator';

export class UserSubscribeDto {
    @IsUUID()
    userID: string;
}
