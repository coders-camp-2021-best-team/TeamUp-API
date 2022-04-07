import { NotFoundException } from '../common';
import { S3Service } from '../s3';
import { User } from './entities';

export const UserAvatarService = new (class {
    async createAvatar(user: User, file: Express.MulterS3.File) {
        if (user.avatar) {
            await S3Service.deleteFile(user.avatar);
        }

        user.avatar = file.key;

        return user.save();
    }

    async removeAvatar(userID: string) {
        const user = await User.findOne(userID);
        if (!user || !user.avatar) throw new NotFoundException();

        await S3Service.deleteFile(user.avatar);

        user.avatar = undefined;

        return user.save();
    }
})();
