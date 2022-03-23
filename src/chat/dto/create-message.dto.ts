import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
    @IsUUID()
    roomID: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
