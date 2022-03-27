import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import {
    AuthMiddleware,
    BadRequestException,
    Controller,
    ForbiddenException
} from '../common';
import { S3Service } from '../s3';
import { UserPhotoService } from '.';

export class UserPhotoController extends Controller {
    constructor() {
        super('/');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/:id/photo', this.getPhotos);
        router.post(
            '/:id/photo',
            S3Service.upload.single('photo'),
            this.createPhoto
        );
        router.delete('/:id/photo/:pid', this.removePhoto);
    }

    async getPhotos(req: Request, res: Response) {
        const targetID = req.params.id;

        const photos = await UserPhotoService.getPhotos(targetID);

        res.send(instanceToPlain(photos));
    }

    async createPhoto(req: Request, res: Response) {
        if (!req.file) throw new BadRequestException();

        if (req.params.id !== req.user!.id) throw new ForbiddenException();

        const photo = await UserPhotoService.createPhoto(
            req.user!,
            req.file as Express.MulterS3.File
        );

        res.send(instanceToPlain(photo));
    }

    async removePhoto(req: Request, res: Response) {
        const targetID = req.params.id;
        const photoID = req.params.pid;

        await UserPhotoService.removePhoto(req.user!, targetID, photoID);

        res.send();
    }
}
