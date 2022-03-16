import { User, UpdateUserDto } from '.';
import { EmailService } from '../email/email.service';
import { UserStatus } from './entities';

export const UserService = new (class {
    async getUser(userId: string) {
        const user = await User.findOne(userId);

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

        user.email = userData.email || user.email;
        user.username = userData.username || user.username;
        user.first_name = userData.first_name || user.first_name;
        user.last_name = userData.last_name || user.last_name;
        user.biogram = userData.biogram || user.biogram;

        return user.save();
    }

    async activateUser(userId: string) {
        const user = await User.findOne(userId);

        if (!user) {
            return null;
        }

        user.status = UserStatus.ACTIVE;

        return user.save();
    }

    async requestPasswordReset(userMail: string) {
        const user = await User.findOne({ where: { email: userMail } });
        if (!user) {
            return null;
        }

        EmailService.resetPasswordEmail(user.email, user.username, user.id);
    }

    // reset password - service

    async resetPassword(userMail: string, userPassword: string) {
        const user = await User.findOne({
            where: { email: userMail, passwordHash: userPassword }
        });
        if (!user) {
            return null;
        }

        EmailService.resetPasswordEmail(user.email, user.passwordHash, user.id);
    }
})();
