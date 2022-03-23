import { IsEnum } from 'class-validator';

enum PostVoteType {
    UPVOTE = 'UPVOTE',
    DOWNVOTE = 'DOWNVOTE'
}

export class CreateVoteDto {
    @IsEnum(PostVoteType)
    type: PostVoteType;
}
