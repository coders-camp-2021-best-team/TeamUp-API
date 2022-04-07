import { ForbiddenException, NotFoundException } from '../common';
import { S3Service } from '../s3';
import { User, UserPhoto } from '.';
import { UserAccountRole } from './entities';

export const UserPhotoService = new (class {
    async getUser(id: string) {
        const user = await User.findOne(id, {
            relations: ['photos']
        });
        if (!user) throw new NotFoundException();

        return user;
    }

    async getPhotos(userID: string) {
        return (await this.getUser(userID)).photos;
    }

    async createPhoto({ id }: User, file: Express.MulterS3.File) {
        const user = await this.getUser(id);

        const photo = new UserPhoto();
        photo.key = file.key;

        user.photos.push(photo);

        await user.save();

        return photo;
    }

    async removePhoto(currentUser: User, targetID: string, photoID: string) {
        const targetUser = await this.getUser(targetID);

        if (
            currentUser.role !== UserAccountRole.ADMIN &&
            currentUser.id !== targetID
        ) {
            throw new ForbiddenException();
        }

        const photo = await UserPhoto.findOne(photoID, {
            where: { user: targetUser },
            relations: ['user']
        });
        if (!photo) throw new NotFoundException();

        await S3Service.deleteFile(photo.key);

        return photo.remove();
    }
})();
