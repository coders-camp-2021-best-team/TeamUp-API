import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../user';
import { Post } from '.';

export enum PostVoteType {
    UPVOTE = 'UPVOTE',
    DOWNVOTE = 'DOWNVOTE'
}

@Entity('post_votes')
export class PostVote extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Post, (m) => m.votes, { onDelete: 'CASCADE' })
    post: Post;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    user: User;

    @Column('enum', { enum: PostVoteType })
    type: PostVoteType;
}
