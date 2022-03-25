import { IsString, Length } from 'class-validator';

export class AddLevelDto {
    @IsString()
    @Length(1, 128)
    name: string;
}
