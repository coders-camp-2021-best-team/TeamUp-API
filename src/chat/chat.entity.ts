import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Message } from './message.entity';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    recipient1: User;

    @ManyToOne(() => User)
    recipient2: User;

    @OneToMany(() => Message, (m) => m.chat)
    messages: Message[];
}
