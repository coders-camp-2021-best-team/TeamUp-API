import { IsEmail } from 'class-validator';

export class PasswordResetRequestDto {
    @IsEmail()
    email: string;
}
