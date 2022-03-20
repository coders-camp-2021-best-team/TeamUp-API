import { Type } from 'class-transformer';
import {
    IsDate,
    IsOptional,
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    MaxDate
} from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @Length(8)
    current_password: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    @MaxDate(new Date(Date.now() - 16 * 365 * 24 * 60 * 60 * 1000))
    birthdate?: Date;

    @IsOptional()
    @IsString()
    @Length(3, 64)
    username?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    first_name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    last_name?: string;

    @IsOptional()
    @IsString()
    @Length(0, 128)
    biogram?: string;

    @IsOptional()
    @IsString()
    @Length(8)
    new_password?: string;
}
