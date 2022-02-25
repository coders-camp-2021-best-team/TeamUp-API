import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @OneToOne(() => User)
    recepient1: User;
    @OneToOne(() => User)
    recepient2: User;
}
