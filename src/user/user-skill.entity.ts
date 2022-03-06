import {
    BaseEntity,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Game } from '../game/game.entity';
import { ExperienceLevel } from '../game/level.entity';
import { User } from './user.entity';

@Entity('user_skills')
export class UserSkill extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (u) => u.skills)
    user: User;

    @ManyToOne(() => Game)
    @JoinColumn()
    game: Game;

    @ManyToOne(() => ExperienceLevel)
    @JoinColumn()
    level: ExperienceLevel;
}
