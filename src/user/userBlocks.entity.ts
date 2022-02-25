import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @OneToOne(() => User)
    user: User;
    @OneToOne(() => User)
    blocked: User;
}
