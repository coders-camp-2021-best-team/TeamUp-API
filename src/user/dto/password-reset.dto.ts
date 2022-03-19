import { IsString, Length } from 'class-validator';

export class PasswordResetDto {
    @IsString()
    @Length(8)
    password: string;
}
