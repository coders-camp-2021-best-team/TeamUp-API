import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../user/user.entity';

export enum UserReportStatus {
    PENDING = 'PENDING',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED'
}

@Entity('user_reports')
export class UserReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    submittedBy: User;

    @ManyToOne(() => User)
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
