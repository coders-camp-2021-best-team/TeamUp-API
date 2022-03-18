import { IsEmail } from 'class-validator';

export class PasswordResetDto {
    @IsEmail()
    email: string;
}
