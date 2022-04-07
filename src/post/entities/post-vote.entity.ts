import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { User } from '../../user';
import { Post, PostVoteType } from '.';

@Entity('post_votes')
export class PostVote extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Post, (m) => m.votes, { onDelete: 'CASCADE' })
    post: Post;

    @ManyToOne(() => User, { onDelete: 'SET NULL', eager: true })
    user: User;

    @Column('enum', { enum: PostVoteType })
    type: PostVoteType;
}
