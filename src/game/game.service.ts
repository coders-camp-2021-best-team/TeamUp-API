import { Game, ExperienceLevel, AddGameDto, AddLevelDto } from '.';
import { UserSkill, User } from '../user';
export const GameService = new (class {
    async getUserGames(userID: string) {
        const user = await User.findOne(userID, {
            relations: ['skills']
        });
        if (!user) {
            return null;
        }

        return user.skills;
    }

    async getGame(userID: string, gameID: string) {
        const skill = await UserSkill.findOne(gameID, {
            relations: ['user'],
            where: {
                user: {
                    id: userID
                }
            }
        });
        if (!skill) {
            return null;
        }

        return skill.game;
    }

    async addGame(userID: string, data: AddGameDto) {
        const user = await User.findOne(userID, {
            relations: ['skills', 'skills.game']
        });

        if (!user) {
            return null;
        }

        const skill = new UserSkill();
        if (user.skills.some((s) => s.game.name === data.name)) {
            return null;
        }
        const game = new Game();

        game.name = data.name;

        game.save();

        skill.game = game;

        skill.user = user;

        return skill.save();
    }

    async removeGame(userID: string, gameID: string) {
        const skill = await UserSkill.findOne(gameID, {
            relations: ['user'],
            where: {
                user: {
                    id: userID
                }
            }
        });

        if (!skill) {
            return null;
        }
        skill.game.remove();

        if (skill.level) {
            skill.level.remove();
        }

        return skill.remove();
    }

    async getExperienceLevel(userID: string, gameID: string) {
        const skill = await UserSkill.findOne(gameID, {
            relations: ['user'],
            where: {
                user: {
                    id: userID
                }
            }
        });

        if (!skill) {
            return null;
        }

        return skill.level;
    }

    async addExperienceLevel(
        userID: string,
        gameID: string,
        data: AddLevelDto
    ) {
        const skill = await UserSkill.findOne(gameID, {
            relations: ['user'],
            where: {
                user: {
                    id: userID
                }
            }
        });
        if (!skill) {
            return null;
        }

        const level = new ExperienceLevel();
        level.name = data.name;

        if (skill.level) {
            return null;
        }

        skill.level = level;
        return skill.save();
    }

    async removeExperienceLevel(
        userID: string,
        gameID: string,
        levelID: string
    ) {
        const skill = await UserSkill.findOne(gameID, {
            relations: ['user'],
            where: {
                user: {
                    id: userID
                }
            }
        });

        if (!skill) {
            return null;
        }

        if (!skill.level || skill.level.id !== levelID) {
            return null;
        }

        return skill.level.remove();
    }
})();
