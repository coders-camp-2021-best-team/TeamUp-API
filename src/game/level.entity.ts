import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity('game_experience_levels')
export class ExperienceLevel {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(() => Game, (g) => g.levels)
    game: Game;
    @Column()
    name: string;
}
