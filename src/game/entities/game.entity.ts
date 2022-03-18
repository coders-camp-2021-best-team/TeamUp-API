import { BaseEntity, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ExperienceLevel } from '.';
import { UserSkill } from '../../user';

@Entity('games')
export class Game extends BaseEntity {
    @PrimaryColumn()
    name: string;

    @OneToMany(() => ExperienceLevel, (el) => el.game)
    levels: ExperienceLevel[];

    @OneToMany(() => UserSkill, (s) => s.game)
    skilled_users: UserSkill[];
}
