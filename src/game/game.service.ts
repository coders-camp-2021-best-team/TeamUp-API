import { Game, ExperienceLevel, AddGameDto, AddLevelDto } from '.';

export const GameService = new (class {
    async getAllGames() {
        const games = await Game.find();

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

    async getExperienceLevels(gameId: string) {
        const levels = await Game.find({
            relations: ['levels'],
            where: {
                id: `${gameId}`
            }
        });

        return levels;
    }

    async addExperienceLevel(gameId: string, data: AddLevelDto) {
        const game = await Game.findOne(gameId);

        if (!game) {
            return null;
        }

        const level = new ExperienceLevel();

        level.game.name = game.name;

        level.name = data.name;

        return level.save();
    }

    async removeExperienceLevel(gameId: string, levelId: string) {
        const level = await ExperienceLevel.findOne(levelId);

        const game = await Game.findOne(gameId);

        if (!level || !game) {
            return null;
        }

        if (level.game.name != game.name) {
            return null;
        }

        return level.remove();
    }
})();
