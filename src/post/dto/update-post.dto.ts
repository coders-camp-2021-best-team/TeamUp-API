import {
    ArrayMaxSize,
    ArrayUnique,
    IsArray,
    IsOptional,
    IsString,
    IsUUID,
    Length
} from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @Length(5, 128)
    title?: string;

    @IsOptional()
    @IsString()
    @Length(0, 65535)
    body?: string;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(5)
    @ArrayUnique()
    @IsUUID('4', { each: true })
    categories?: string[];

    // TODO: attachments
}
