import { User, UpdateUserDto } from '.';

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
})();
