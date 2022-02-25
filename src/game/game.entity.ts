import {
    Column,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { ExperienceLevel } from './level.entity';

@Entity('games')
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;
    @OneToMany(() => ExperienceLevel, (el) => el.game)
    @JoinTable({})
    levels: ExperienceLevel[];
}
