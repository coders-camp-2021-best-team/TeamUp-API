import { S3Service } from '../s3';
import { User } from './entities';

export const UserAvatarService = new (class {
    async createAvatar(userID: string, file: Express.MulterS3.File) {
        const user = await User.findOne(userID);
        if (!user) return null;

        user.avatar = file.key;

        return user.save();
    }

    async removeAvatar(userID: string) {
        const user = await User.findOne(userID);
        if (!user) return null;

        if (!user.avatar) return null;

        await S3Service.deleteFile(user.avatar);

        user.avatar = undefined;

        return user.save();
    }
})();
