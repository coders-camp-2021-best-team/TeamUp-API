import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthMiddleware, Controller } from '../common';
import { S3Service } from '../s3';
import { UserAvatarService } from '.';

export class UserAvatarController extends Controller {
    constructor() {
        super('/avatar');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.post('/', S3Service.upload.single('avatar'), this.createAvatar);
        router.delete('/', this.removeAvatar);
    }

    async createAvatar(req: Request, res: Response) {
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        const updated = await UserAvatarService.createAvatar(
            req.session.userID || '',
            req.file as Express.MulterS3.File
        );

        if (!updated) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        res.send(instanceToPlain(updated));
    }

    async removeAvatar(req: Request, res: Response) {
        const removed = await UserAvatarService.removeAvatar(
            req.session.userID || ''
        );

        if (!removed) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        return res.send(instanceToPlain(removed));
    }
}
