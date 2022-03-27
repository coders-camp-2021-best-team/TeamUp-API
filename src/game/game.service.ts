import { ConflictException, NotFoundException } from '../common';
import { AddGameDto, AddLevelDto, ExperienceLevel, Game } from '.';

export const GameService = new (class {
    async getAllGames() {
        const games = await Game.find();

        return games;
    }

    async getGame(gameID: string) {
        const game = await Game.findOne(gameID, {
            relations: ['levels']
        });
        if (!game) throw new NotFoundException();

        return game;
    }

    async addGame(data: AddGameDto) {
        const game = new Game();

        game.name = data.name;

        return game.save();
    }

    async removeGame(gameID: string) {
        const game = await Game.findOne(gameID);
        if (!game) throw new NotFoundException();

        return game.remove();
    }

    async addExperienceLevel(gameID: string, data: AddLevelDto) {
        const game = await this.getGame(gameID);

        if (game.levels.some((l) => l.name === data.name)) {
            throw new ConflictException();
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
        if (!level) throw new NotFoundException();

        return level.remove();
    }
})();
