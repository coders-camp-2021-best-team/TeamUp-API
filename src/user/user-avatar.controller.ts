import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import {
    AuthMiddleware,
    BadRequestException,
    Controller,
    ForbiddenException
} from '../common';
import { S3Service } from '../s3';
import { UserAvatarService } from '.';

export class UserAvatarController extends Controller {
    constructor() {
        super('/');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.post(
            '/:id/avatar',
            S3Service.upload.single('avatar'),
            this.createAvatar
        );
        router.delete('/:id/avatar', this.removeAvatar);
    }

    async createAvatar(req: Request, res: Response) {
        if (!req.file) throw new BadRequestException();

        if (req.params.id !== req.user!.id) throw new ForbiddenException();

        const updated = await UserAvatarService.createAvatar(
            req.user!,
            req.file as Express.MulterS3.File
        );

        res.send(instanceToPlain(updated));
    }

    async removeAvatar(req: Request, res: Response) {
        const id = req.params.id;
        if (!req.user!.isAdmin() && id !== req.user!.id) {
            throw new ForbiddenException();
        }

        const removed = await UserAvatarService.removeAvatar(id);

        return res.send(instanceToPlain(removed));
    }
}
