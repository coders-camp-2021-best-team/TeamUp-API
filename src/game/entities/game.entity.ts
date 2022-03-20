import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { ExperienceLevel } from '.';

@Entity('games')
export class Game extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => ExperienceLevel, (el) => el.game)
    levels: ExperienceLevel[];
}
