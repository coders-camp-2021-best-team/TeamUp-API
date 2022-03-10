import { Game, ExperienceLevel, AddGameDto, AddLevelDto } from '.';

export const GameService = new (class {
    async getAllGames() {
        const games = await Game.find();

        if (!games.length) {
            return null;
        }
        return games;
    }

    async getGame(gameId: string) {
        const game = await Game.findOne(gameId);

        if (!game) {
            return null;
        }

        return game;
    }

    async addGame(data: AddGameDto) {
        const game = new Game();

        game.name = data.name;

        return game.save();
    }

    async removeGame(gameId: string) {
        const game = await Game.findOne(gameId);

        if (!game) {
            return null;
        }

        return game.remove();
    }

    async addExperienceLevel(data: AddLevelDto) {
        const level = new ExperienceLevel();

        level.name = data.name;

        return level.save();
    }

    async removeExperienceLevel(levelId: string) {
        const level = await ExperienceLevel.findOne(levelId);

        if (!level) {
            return null;
        }

        return level.remove();
    }
})();
