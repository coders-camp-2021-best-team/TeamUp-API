import { IsNotEmpty, IsString } from 'class-validator';
import { Game, ExperienceLevel } from '../../game';

export class RecomendedDTo {
    @IsNotEmpty()
    game: Game;

    // @IsNotEmpty()
    // experienceLvL: ExperienceLevel;
}
