import { getRepository } from 'typeorm';
import { User } from './user.entity';

export const UserService = new (class {
    async getUser(userId: string) {
        const userRepo = getRepository(User);

        const user = await userRepo.findOne(userId);

        if (!user) return null;

        return user;
    }

    async updateUser(userId: string, userData: Partial<User>) {
        const userRepo = getRepository(User);

        let user = await userRepo.findOne(userId);

        if (!user) return null;

        user = { ...user, ...userData };

        await userRepo.save(user);

        return user;
    }
})();
