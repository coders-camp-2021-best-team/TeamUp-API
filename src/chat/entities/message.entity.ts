import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../user';
import { Chat } from '.';

@Entity('chat_messages')
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Chat, (c) => c.messages)
    chat: Chat;

    @ManyToOne(() => User)
    author: User;

    @Column('longtext')
    content: string;
}