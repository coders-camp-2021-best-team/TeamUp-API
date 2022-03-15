import { User, UserSkill } from '../user';
import { Game } from '../game/index';
import { RecomendedDTo } from './dto/recomended.dto';

export const FeedService = new (class {
    async recomended(data: RecomendedDTo) {
        const users = await this.getUsersByGame(data.game);
        if (!users) {
            return null;
        }
        return users;
    }

    getUsersByGame(game: Game) {
        return UserSkill.find({
            where: { game }
        });
    }
})();
