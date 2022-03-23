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

    @Column({ unique: true })
    name: string;

    @OneToMany(() => ExperienceLevel, (el) => el.game, {
        cascade: true
    })
    levels: ExperienceLevel[];
}
