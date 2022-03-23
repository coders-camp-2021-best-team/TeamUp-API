import { Game, ExperienceLevel, AddGameDto, AddLevelDto } from '.';

export const GameService = new (class {
    async getAllGames() {
        const games = await Game.find();

        return games;
    }

    async getGame(gameID: string) {
        const game = await Game.findOne(gameID, {
            relations: ['levels']
        });
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

    async removeGame(gameID: string) {
        const game = await Game.findOne(gameID);

        if (!game) {
            return null;
        }

        return game.remove();
    }

    async addExperienceLevel(gameID: string, data: AddLevelDto) {
        const game = await Game.findOne(gameID, {
            relations: ['levels']
        });

        if (!game) {
            return null;
        }

        if (game.levels.some((l) => l.name === data.name)) {
            return null;
        }

        const level = new ExperienceLevel();
        level.name = data.name;

        game.levels.push(level);
        return game.save();
    }

    async removeExperienceLevel(gameID: string, levelID: string) {
        const level = await ExperienceLevel.findOne(levelID, {
            relations: ['game'],
            where: {
                game: {
                    id: gameID
                }
            }
        });

        if (!level) {
            return null;
        }

        return level.remove();
    }
})();
