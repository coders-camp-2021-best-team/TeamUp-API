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
            S3Service.upload.array('attachments', 10),
            this.createAttachment
        );
        router.delete('/:id/attachment/:aid', this.removeAttachment);
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
        if (!req.files) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        const attachment = await PostAttachmentService.createAttachment(
            req.session.userID || '',
            req.params.id,
            req.files as Express.MulterS3.File[]
        );

        if (!attachment) {
            return res.status(StatusCodes.FORBIDDEN).send();
        }

        return res.send(instanceToPlain(attachment));
    }

    async removeAttachment(req: Request, res: Response) {
        const removed = await PostAttachmentService.removeAttachment(
            req.session.userID || '',
            req.params.id,
            req.params.aid
        );

        if (!removed) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send();
    }
}
