import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ExperienceLevel } from '../../game';
import { User } from '.';

@Entity('user_skills')
export class UserSkill extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (u) => u.skills, { onDelete: 'CASCADE' })
    user?: User;

    @ManyToOne(() => ExperienceLevel, {
        eager: true,
        onDelete: 'CASCADE'
    })
    level: ExperienceLevel;
}
