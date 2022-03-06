import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Game } from '.';

@Entity('game_experience_levels')
export class ExperienceLevel extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Game, (g) => g.levels)
    game: Game;

    @Column()
    name: string;
}
