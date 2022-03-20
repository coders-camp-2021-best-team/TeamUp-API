import { Game, ExperienceLevel, AddGameDto, AddLevelDto } from '.';

export const GameService = new (class {
    async getAllGames() {
        const games = await Game.find();

        return games;
    }

    async getGame(gameName: string) {
        const game = await Game.findOne(gameName);
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

    async removeGame(gameName: string) {
        const game = await Game.findOne(gameName);

        if (!game) {
            return null;
        }

        return game.remove();
    }

    async getExperienceLevels(gameName: string) {
        const game = await Game.findOne(gameName, {
            relations: ['levels']
        });

        if (!game) {
            return null;
        }

        return game.levels;
    }

    async addExperienceLevel(gameName: string, data: AddLevelDto) {
        const game = await Game.findOne(gameName, {
            relations: ['levels']
        });

        if (!game) {
            return null;
        }

        const level = new ExperienceLevel();

        level.name = data.name;

        level.save();
        game.levels.push(level);

        return game.save();
    }

    async removeExperienceLevel(gameName: string, levelId: string) {
        const level = await ExperienceLevel.findOne(levelId, {
            relations: ['game'],
            where: {
                game: {
                    name: gameName
                }
            }
        });

        if (!level) {
            return null;
        }

        return level.remove();
    }
})();
