import { IsEnum, IsUUID } from 'class-validator';

export enum MessageStatus {
    START_TYPING = 'START_TYPING',
    STOP_TYPING = 'STOP_TYPING'
}

export class MessageStatusDto {
    @IsUUID()
    roomID: string;

    @IsEnum(MessageStatus)
    status: MessageStatus;
}
