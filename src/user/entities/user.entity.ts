import { Exclude } from 'class-transformer';
import {
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    BaseEntity
} from 'typeorm';

import { UserBlock } from '../../block';
import { Meme } from '../../memes';
import { UserReport } from '../../report';
import { UserSwipe } from '../../swipe';
import { UserAvatar, UserPhoto, UserSkill } from '.';

export enum UserStatus {
    BLOCKED = 'BLOCKED',
    ACTIVE = 'ACTIVE'
}

@Entity('users')
export class User extends BaseEntity {
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

    @Column('date')
    birthdate: Date;

    @Column('longtext', { default: '' })
    biogram: string;

    @Column('enum', { enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @OneToOne(() => UserAvatar, (a) => a.user, {
        eager: true
    })
    avatar: UserAvatar;

    @OneToMany(() => UserPhoto, (p) => p.user)
    photos: UserPhoto[];

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