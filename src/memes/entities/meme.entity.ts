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

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    author: User;

    @Column()
    title: string;

    @OneToOne(() => Asset, { onDelete: 'CASCADE' })
    @JoinColumn()
    image: Asset;

    @OneToMany(() => MemeVote, (v) => v.meme, { cascade: true })
    votes: MemeVote[];
}
