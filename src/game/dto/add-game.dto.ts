import { IsString, Length } from 'class-validator';

export class AddGameDto {
    @IsString()
    @Length(1, 256)
    name: string;
}
