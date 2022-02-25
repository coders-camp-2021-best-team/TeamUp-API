import {
    Column,
    Entity,
    JoinTable,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { UserGame } from './userGames.entity';

export enum userStatus {
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
    passwordHash: string;
    @Column()
    first_name: string;
    @Column()
    last_name: string;
    @OneToOne(() => Asset)
    avatar: Asset;
    @Column('int')
    age: number;
    @Column('longtext')
    biogram: string;
    @Column('enum', { enum: userStatus, default: userStatus.ACTIVE })
    status: userStatus;
    @OneToMany(() => UserGame, (ug) => ug.user)
    @JoinTable()
    games: UserGame[];
}
