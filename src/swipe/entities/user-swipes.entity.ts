import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../user';

export enum UserSwipeType {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE'
}

@Entity('user_swipes')
export class UserSwipe extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    submittedBy: User;

    @ManyToOne(() => User, { eager: true })
    target: User;

    @Column('enum', { enum: UserSwipeType })
    status: UserSwipeType;
}
