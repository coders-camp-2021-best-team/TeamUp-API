import { Request, Response } from 'express';
import { AuthMiddleware, Controller } from '../common';
import { StatusCodes } from 'http-status-codes';
import { instanceToPlain } from 'class-transformer';
import { BlockService } from '.';

export class BlockController extends Controller {
    constructor() {
        super('/block');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getBlockedUsers);
        router.post('/:id', this.blockUser);
        router.delete('/:id', this.unblockUser);
    }

    async getBlockedUsers(req: Request, res: Response) {
        const users = await BlockService.getBlockedUsers(
            req.session.userID || ''
        );

        if (!users) {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }

        res.send(instanceToPlain(users));
    }

    async blockUser(req: Request, res: Response) {
        const targetID = req.params.id;

        const blocks = await BlockService.blockUser(
            req.session.userID || '',
            targetID
        );

        if (!blocks) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        return res.send(instanceToPlain(blocks));
    }

    async unblockUser(req: Request, res: Response) {
        const blockID = req.params.id;

        const unblocked = await BlockService.unblockUser(
            req.session.userID || '',
            blockID
        );

        if (!unblocked) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        return res.send();
    }
}
