import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Game } from '../game/game.entity';
import { ExperienceLevel } from '../game/level.entity';
import { User } from './user.entity';

@Entity('user_games')
export class UserGame {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(() => User, (u) => u.games)
    user: User;
    @OneToOne(() => Game)
    @JoinColumn()
    game: Game;
    @OneToOne(() => ExperienceLevel)
    @JoinColumn()
    level: ExperienceLevel;
}
