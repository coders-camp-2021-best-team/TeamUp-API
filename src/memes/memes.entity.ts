import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { User } from '../user/user.entity';

@Entity('memes')
export class Meme {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @OneToOne(() => User)
    author: User;
    @Column()
    title: string;
    @OneToOne(() => Asset)
    image: Asset;
}
