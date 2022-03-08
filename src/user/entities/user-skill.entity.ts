import {
    BaseEntity,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Game, ExperienceLevel } from '../../game';
import { User } from '.';

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
