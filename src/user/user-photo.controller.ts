import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthMiddleware, Controller } from '../common';
import { UserPhotoService } from '.';
import { S3Service } from '../s3';

export class UserPhotoController extends Controller {
    constructor() {
        super('/');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/:id/photo', this.getPhotos);
        router.post(
            '/photo',
            S3Service.upload.single('photo'),
            this.createPhoto
        );
        router.delete('/:id/photo/:pid', this.removePhoto);
    }

    async getPhotos(req: Request, res: Response) {
        const targetID = req.params.id;

        const photos = await UserPhotoService.getPhotos(targetID);

        if (!photos) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send(instanceToPlain(photos));
    }

    async createPhoto(req: Request, res: Response) {
        const currentID = req.session.userID || '';

        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        const photo = await UserPhotoService.createPhoto(
            currentID,
            req.file as Express.MulterS3.File
        );

        if (!photo) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        res.send(instanceToPlain(photo));
    }

    async removePhoto(req: Request, res: Response) {
        const currentID = req.session.userID || '';
        const targetID = req.params.id;
        const photoID = req.params.pid;

        const removed = await UserPhotoService.removePhoto(
            currentID,
            targetID,
            photoID
        );

        if (!removed) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send();
    }
}
