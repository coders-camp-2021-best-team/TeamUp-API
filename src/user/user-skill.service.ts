import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException
} from '../common';
import { ExperienceLevel } from '../game';
import { User, UserService, UserSkill } from '.';

export const UserSkillService = new (class {
    async addUserSkill(user: User, levelID: string) {
        const level = await ExperienceLevel.findOne(levelID, {
            relations: ['game']
        });
        if (!level) throw new NotFoundException();

        try {
            user = await UserService.getUser(user.id);
        } catch {
            throw new InternalServerErrorException();
        }

        const skill = new UserSkill();
        skill.level = level;

        if (!user.skills.some((s) => s.level.game.id === level.game.id)) {
            user.skills.push(skill);
        } else {
            throw new ConflictException('You already have that skill');
        }

        await user.save();
        return user.skills;
    }

    async removeUserSkill(user: User, skillID: string) {
        const skill = await UserSkill.findOne(skillID, {
            where: user,
            relations: ['user']
        });
        if (!skill) throw new NotFoundException();

        return skill.remove();
    }
})();
