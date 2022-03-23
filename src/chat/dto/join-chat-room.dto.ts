import { IsUUID } from 'class-validator';

export class JoinChatRoomDto {
    @IsUUID()
    roomID: string;
}
