import { IsEnum } from 'class-validator';

// FIXME: circular dependency
enum PostVoteType {
    UPVOTE = 'UPVOTE',
    DOWNVOTE = 'DOWNVOTE'
}

export class CreateVoteDto {
    @IsEnum(PostVoteType)
    type: PostVoteType;
}
