import { Exclude } from 'class-transformer';
import {
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { UserBlock } from '../block/user-block.entity';
import { Meme } from '../memes/meme.entity';
import { UserReport } from '../report/user-report.entity';
import { UserSwipe } from '../swipe/user-swipes.entity';
import { UserAvatar } from './user-avatar.entity';
import { UserPhoto } from './user-photo.entity';
import { UserSkill } from './user-skill.entity';

export enum UserStatus {
    BLOCKED = 'BLOCKED',
    ACTIVE = 'ACTIVE'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    @Exclude()
    passwordHash: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @OneToOne(() => UserAvatar, (a) => a.user)
    avatar: UserAvatar;

    @OneToMany(() => UserPhoto, (p) => p.user)
    photos: UserPhoto[];

    @Column('int')
    age: number;

    @Column('longtext')
    biogram: string;

    @Column('enum', { enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @OneToMany(() => UserSkill, (ug) => ug.user)
    skills: UserSkill[];

    @OneToMany(() => UserBlock, (b) => b.blockedBy)
    blockedUsers: UserBlock[];

    @OneToMany(() => UserBlock, (u) => u.target)
    blockedBy: UserBlock[];

    @OneToMany(() => UserReport, (r) => r.target)
    submittedReports: UserReport[];

    @OneToMany(() => UserReport, (r) => r.submittedBy)
    receivedReports: UserReport[];

    @OneToMany(() => UserSwipe, (s) => s.target)
    swipedUsers: UserSwipe[];

    @OneToMany(() => UserSwipe, (s) => s.submittedBy)
    swipedBy: UserSwipe[];

    @OneToMany(() => Meme, (m) => m.author)
    postedMemes: Meme[];
}
