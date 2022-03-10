import { Length, IsString } from 'class-validator';

export class CreateGameDto {
    @IsString()
    @Length(1, 256)
    name: string;
}
