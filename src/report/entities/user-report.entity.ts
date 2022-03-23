import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../user';
import { UserReportStatus } from './user-report-status.enum';

@Entity('user_reports')
export class UserReport extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    submittedBy: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    target: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdOn: Date;

    @Column()
    reason: string;

    @Column('enum', {
        enum: UserReportStatus,
        default: UserReportStatus.PENDING
    })
    status: UserReportStatus;
}
