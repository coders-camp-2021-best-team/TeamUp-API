import { Contains, Length, IsString } from 'class-validator';

export class GreetingDto {
    @IsString()
    @Length(5, 128)
    @Contains('{name}')
    text: string;
}
