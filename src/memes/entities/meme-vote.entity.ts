import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../user';
import { Meme } from '.';

export enum MemeVoteType {
    UPVOTE = 'UPVOTE',
    DOWNVOTE = 'DOWNVOTE'
}

@Entity('meme_votes')
export class MemeVote extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Meme, (m) => m.votes)
    meme: Meme;

    @ManyToOne(() => User)
    user: User;

    @Column('enum', { enum: MemeVoteType })
    type: MemeVoteType;
}