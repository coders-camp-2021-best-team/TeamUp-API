import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Meme } from './memes.entity';

export enum memesVote {
    UPVOTE = 'UPVOTE',
    DOWNVOTE = 'DOWNVOTE'
}

@Entity('memes_votes')
export class memeVotes {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @OneToOne(() => Meme)
    meme: Meme;
    @OneToOne(() => User)
    user: User;
    @Column('enum', { enum: memesVote })
    status: memesVote;
}
