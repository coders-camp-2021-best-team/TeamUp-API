import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Chat } from './chat.entity';

@Entity('messages')
export class message {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @OneToOne(() => Chat)
    chat: Chat;
    @OneToOne(() => User)
    author: User;
    @Column('longtext')
    content: string;
}
