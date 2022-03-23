import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../user';

@Entity('user_blocks')
export class UserBlock extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    blockedBy: User;

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    target: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdOn: Date;
}
