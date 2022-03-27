import { AuthService } from '../auth';
import { NotFoundException, UnauthorizedException } from '../common';
import { UpdateUserDto, User } from '.';

export const UserService = new (class {
    async getUser(userID: string) {
        const user = await User.findOne(userID, {
            relations: ['skills', 'skills.level', 'skills.level.game']
        });
        if (!user) throw new NotFoundException();

        return user;
    }

    async updateUser(user: User, userData: UpdateUserDto) {
        if (
            !AuthService.verifyPassword(
                userData.current_password,
                user.passwordHash
            )
        ) {
            throw new UnauthorizedException();
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
})();
