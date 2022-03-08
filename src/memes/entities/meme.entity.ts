import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Asset } from '../../assets';
import { User } from '../../user';
import { MemeVote } from '.';

@Entity('memes')
export class Meme extends BaseEntity {
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
