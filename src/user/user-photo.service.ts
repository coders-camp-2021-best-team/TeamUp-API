import { S3Service } from '../s3';
import { User, UserPhoto, UserRank } from '.';

export const UserPhotoService = new (class {
    async getPhotos(userID: string) {
        const user = await User.findOne(userID, {
            relations: ['photos']
        });
        if (!user) return null;

        return user.photos;
    }

    async createPhoto(userID: string, file: Express.MulterS3.File) {
        const user = await User.findOne(userID, {
            relations: ['photos']
        });
        if (!user) return null;

        const photo = new UserPhoto();
        photo.key = file.key;

        user.photos.push(photo);

        await user.save();

        return photo;
    }

    async removePhoto(userID: string, targetID: string, photoID: string) {
        const user = await User.findOne(userID);
        if (!user || !targetID) return null;

        if (user.rank !== UserRank.ADMIN && userID !== targetID) {
            return null;
        }

        const photo = await UserPhoto.findOne(photoID, {
            where: {
                user: { id: targetID }
            },
            relations: ['user']
        });

        if (!photo) return null;

        await S3Service.deleteFile(photo.key);

        return photo.remove();
    }
})();
