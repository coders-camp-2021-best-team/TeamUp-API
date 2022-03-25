import { randomBytes } from 'crypto';

import { AuthService } from '../auth';
import { EmailService, Token, TokenType } from '../email';
import { ExperienceLevel } from '../game';
import { UpdateUserDto, User, UserRegisterStatus } from '.';
import { UserSkill } from './entities';

export const UserService = new (class {
    async getUser(userId: string) {
        const user = await User.findOne(userId, {
            relations: ['skills', 'skills.level', 'skills.level.game']
        });

        if (!user) {
            return null;
        }

        return user;
    }

    async updateUser(userId: string, userData: UpdateUserDto) {
        const user = await User.findOne(userId);

        if (!user) {
            return null;
        }

        if (
            !AuthService.verifyPassword(
                userData.current_password,
                user.passwordHash
            )
        ) {
            return null;
        }

        user.email = userData.email || user.email;
        user.username = userData.username || user.username;
        user.first_name = userData.first_name || user.first_name;
        user.last_name = userData.last_name || user.last_name;
        user.biogram = userData.biogram || user.biogram;
        user.passwordHash = userData.new_password
            ? AuthService.hashPassword(userData.new_password)
            : user.passwordHash;

        return user.save();
    }

    async activateUser(id: string) {
        const token = await Token.findOne(id, {
            relations: ['user']
        });

        if (!token) {
            return null;
        }

        const user = token.user;

        await token.remove();

        user.registerStatus = UserRegisterStatus.VERIFIED;

        return user.save();
    }

    async requestPasswordReset(userMail: string) {
        const user = await User.findOne({ where: { email: userMail } });

        if (!user) {
            return null;
        }

        const reset_token = new Token();
        reset_token.token = randomBytes(64).toString('hex');
        reset_token.token_type = TokenType.PASSWORD_RESET;
        reset_token.user = user;
        await reset_token.save();

        EmailService.resetPasswordEmail(
            user.email,
            user.username,
            reset_token.token
        );

        return true;
    }

    async resetPassword(id: string, userPassword: string) {
        const token = await Token.findOne(id, {
            relations: ['user']
        });

        if (!token) {
            return null;
        }

        const user = token.user;

        await token.remove();

        user.passwordHash = AuthService.hashPassword(userPassword);

        return user.save();
    }

    async addUserSkill(userID: string, levelID: string) {
        const level = await ExperienceLevel.findOne(levelID, {
            relations: ['game']
        });
        if (!level) {
            return null;
        }

        const user = await this.getUser(userID);
        if (!user) {
            return null;
        }

        const skill = new UserSkill();
        skill.level = level;

        if (!user.skills.some((s) => s.level.game.id === level.game.id)) {
            user.skills.push(skill);
        } else {
            return null;
        }

        await user.save();
        return user.skills;
    }

    async removeUserSkill(userID: string, skillID: string) {
        const skill = await UserSkill.findOne(skillID);

        if (!skill) {
            return null;
        }

        return skill.remove();
    }
})();
