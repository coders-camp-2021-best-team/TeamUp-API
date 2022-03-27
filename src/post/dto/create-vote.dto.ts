import { IsEnum } from 'class-validator';

import { PostVoteType } from '../entities/post-vote-type.enum';

export class CreateVoteDto {
    @IsEnum(PostVoteType)
    type: PostVoteType;
}
