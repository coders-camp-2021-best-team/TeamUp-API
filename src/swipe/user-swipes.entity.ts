import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../user/user.entity';

export enum UserSwipeType {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE'
}

@Entity('user_swipes')
export class UserSwipe extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    submittedBy: User;

    @ManyToOne(() => User)
    target: User;

    @Column('enum', { enum: UserSwipeType })
    status: UserSwipeType;
}
