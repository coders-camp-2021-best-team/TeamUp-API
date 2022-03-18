import { BaseEntity, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ExperienceLevel } from '.';

@Entity('games')
export class Game extends BaseEntity {
    @PrimaryColumn()
    name: string;

    @OneToMany(() => ExperienceLevel, (el) => el.game)
    levels: ExperienceLevel[];
}
