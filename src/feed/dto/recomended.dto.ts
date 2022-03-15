import { IsNotEmpty } from 'class-validator';
import { Game } from '../../game';

export class RecomendedDTo {
    @IsNotEmpty()
    game: Game;
}
