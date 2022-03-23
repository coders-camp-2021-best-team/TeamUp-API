import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../user';
import { ChatRoom } from '.';

@Entity('chat_messages')
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdOn: Date;

    @ManyToOne(() => ChatRoom, (c) => c.messages, { onDelete: 'CASCADE' })
    chatroom: ChatRoom;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    author: User;

    @Column('longtext')
    content: string;
}
