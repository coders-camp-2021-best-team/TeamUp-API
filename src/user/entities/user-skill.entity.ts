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

    @ManyToOne(() => User, (u) => u.skills, {
        eager: true
    })
    user: User;

    @ManyToOne(() => Game, (g) => g.skilled_users, {
        eager: true
    })
    @JoinColumn()
    game: Game;

    @ManyToOne(() => ExperienceLevel, {
        eager: true
    })
    @JoinColumn()
    level: ExperienceLevel;
}
