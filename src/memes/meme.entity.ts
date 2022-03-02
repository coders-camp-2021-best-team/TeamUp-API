import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { User } from '../user/user.entity';
import { MemeVote } from './meme-vote.entity';

@Entity('memes')
export class Meme {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    author: User;

    @Column()
    title: string;

    @OneToOne(() => Asset)
    @JoinColumn()
    image: Asset;

    @OneToMany(() => MemeVote, (v) => v.meme)
    votes: MemeVote[];
}
