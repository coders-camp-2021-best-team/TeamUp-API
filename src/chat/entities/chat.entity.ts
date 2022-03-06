import {
    BaseEntity,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../user';
import { Message } from '.';

@Entity('chats')
export class Chat extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    recipient1: User;

    @ManyToOne(() => User)
    recipient2: User;

    @OneToMany(() => Message, (m) => m.chat)
    messages: Message[];
}
