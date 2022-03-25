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

    @Column()
    name: string;

    @ManyToOne(() => Game, (g) => g.levels, { onDelete: 'CASCADE' })
    game: Game;
}
