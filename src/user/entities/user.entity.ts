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
import { UserReport } from '../../report';
import { UserSwipe } from '../../swipe';
import { Token } from '../../email';
import { Post } from '../../post';
import { ChatRoom } from '../../chat';
import { UserPhoto, UserSkill } from '.';

export enum UserStatus {
    BLOCKED = 'BLOCKED',
    ACTIVE = 'ACTIVE'
}

export enum UserRegisterStatus {
    UNVERIFIED = 'UNVERIFIED',
    VERIFIED = 'VERIFIED'
}

export enum UserRank {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export enum UserActivityStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE'
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

    @Column('enum', { enum: UserRank, default: UserRank.USER })
    rank: UserRank;

    @Column('enum', { enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column('enum', {
        enum: UserActivityStatus,
        default: UserActivityStatus.OFFLINE
    })
    activity_status: UserActivityStatus;

    @Column('enum', {
        enum: UserRegisterStatus,
        default: UserRegisterStatus.UNVERIFIED
    })
    registerStatus: UserRegisterStatus;

    @Column({ nullable: true, default: null })
    avatar?: string;

    @OneToMany(() => UserPhoto, (p) => p.user, { cascade: true })
    photos: UserPhoto[];

    @OneToMany(() => UserSkill, (ug) => ug.user, { cascade: true })
    skills: UserSkill[];

    @OneToMany(() => UserBlock, (b) => b.blockedBy, { cascade: true })
    blockedUsers: UserBlock[];

    @OneToMany(() => UserBlock, (u) => u.target)
    blockedBy: UserBlock[];

    @OneToMany(() => UserReport, (r) => r.target)
    submittedReports: UserReport[];

    @OneToMany(() => UserReport, (r) => r.submittedBy, { cascade: true })
    receivedReports: UserReport[];

    @OneToMany(() => UserSwipe, (s) => s.submittedBy)
    swipedUsers: UserSwipe[];

    @OneToMany(() => UserSwipe, (s) => s.target)
    swipedBy: UserSwipe[];

    @OneToMany(() => Post, (m) => m.author)
    posts: Post[];

    @OneToMany(() => Token, (t) => t.user)
    tokens: Token[];

    @OneToMany(() => ChatRoom, (c) => c.recipient1)
    chatroomsByMe: ChatRoom[];

    @OneToMany(() => ChatRoom, (c) => c.recipient2)
    chatroomsWithMe: ChatRoom[];
}
