import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum userReportStatus {
    PENDING = 'PENDING',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED'
}

@Entity('user_reports')
export class UserReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @OneToOne(() => User)
    user: User;
    @Column()
    reason: string;
    @Column('enum', {
        enum: userReportStatus,
        default: userReportStatus.PENDING
    })
    status: userReportStatus;
}
