import { IsNotEmpty, IsString } from 'class-validator';
import { Game, ExperienceLevel } from '../../game';

export class RecomendedDTo {
    @IsNotEmpty()
    @IsString()
    game: Game;

    @IsNotEmpty()
    @IsString()
    experienceLvL: ExperienceLevel;
}
