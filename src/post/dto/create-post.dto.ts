import {
    ArrayMaxSize,
    ArrayUnique,
    IsArray,
    IsString,
    IsUUID,
    Length
} from 'class-validator';

export class CreatePostDto {
    @IsString()
    @Length(5, 128)
    title: string;

    @IsString()
    @Length(0, 65535)
    body: string;

    @IsArray()
    @ArrayMaxSize(5)
    @ArrayUnique()
    @IsUUID('all', { each: true })
    categories: string[];

    // TODO: attachments
}
