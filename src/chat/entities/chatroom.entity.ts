import {
    BaseEntity,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../user';
import { Message } from '.';

@Entity('chat_rooms')
export class ChatRoom extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    recipient1: User;

    @ManyToOne(() => User)
    recipient2: User;

    @OneToMany(() => Message, (m) => m.chatroom)
    messages: Message[];
}
