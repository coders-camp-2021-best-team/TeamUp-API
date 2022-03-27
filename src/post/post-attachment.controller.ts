import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthMiddleware, Controller } from '../common';
import { S3Service } from '../s3';
import { PostAttachmentService } from '.';

export class PostAttachmentController extends Controller {
    constructor() {
        super('/');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/:id/attachment', this.getAttachments);
        router.post(
            '/:id/attachment',
            S3Service.upload.single('attachment'),
            this.createAttachment
        );
        router.delete('/:id/attachment/:key', this.removeAttachment);
    }

    async getAttachments(req: Request, res: Response) {
        const postID = req.params.id;

        const attachments = await PostAttachmentService.getAttachments(postID);

        if (!attachments) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send(instanceToPlain(attachments));
    }

    async createAttachment(req: Request, res: Response) {
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        const attachment = await PostAttachmentService.createAttachment(
            req.user!.id,
            req.params.id,
            req.file as Express.MulterS3.File
        );

        if (!attachment) {
            return res.status(StatusCodes.FORBIDDEN).send();
        }

        return res.send(instanceToPlain(attachment));
    }

    async removeAttachment(req: Request, res: Response) {
        const removed = await PostAttachmentService.removeAttachment(
            req.user!.id,
            req.params.id,
            req.params.key
        );

        if (!removed) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send();
    }
}
