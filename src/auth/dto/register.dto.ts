import { Type } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    MaxDate
} from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(3, 64)
    username: string;

    @IsString()
    @Length(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @Type(() => Date)
    @IsDate()
    @MaxDate(new Date(Date.now() - 16 * 365 * 24 * 60 * 60 * 1000))
    birthdate: Date;
}
