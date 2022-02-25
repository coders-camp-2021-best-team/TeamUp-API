import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum userSwipe {
    LIKE = 'LIKE',
    DISLIKE = 'DISLIKE'
}

@Entity('user_swipes')
export class UserSwipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @OneToOne(() => User)
    author: User;
    @OneToOne(() => User)
    target: User;
    @Column('enum', { enum: userSwipe })
    status: userSwipe;
}
