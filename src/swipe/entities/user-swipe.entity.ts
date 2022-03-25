import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { User } from '../../user';
import { SwipeType } from './swipe-type.enum';

@Entity('user_swipes')
export class UserSwipe extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    submittedBy: User;

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    target: User;

    @Column('enum', { enum: SwipeType })
    status: SwipeType;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedOn: Date;
}
