import { UserSkill } from '../user';
import { ExperienceLevel } from '../game/entities';
import { Game } from '../game/index';
import { RecomendedDTo } from './dto/recomended.dto';

export const FeedService = new (class {
    async recomended(data: RecomendedDTo) {
        const users = await this.getUsersByGame(data.game, data.experienceLvL);
        if (!users) {
            return null;
        }
        return users;
    }

    getUsersByGame(game: Game, level: ExperienceLevel) {
        return UserSkill.find({
            where: { game, level }
        });
    }
})();
