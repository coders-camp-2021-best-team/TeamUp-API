import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../user';
import { UserSwipeType } from './user-swipe.enum';

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
