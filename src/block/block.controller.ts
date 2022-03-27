import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import { AuthMiddleware, Controller } from '../common';
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
        const users = await BlockService.getBlockedUsers(req.user!);

        res.send(instanceToPlain(users));
    }

    async blockUser(req: Request, res: Response) {
        const targetID = req.params.id;

        const blocks = await BlockService.blockUser(req.user!, targetID);

        return res.send(instanceToPlain(blocks));
    }

    async unblockUser(req: Request, res: Response) {
        const blockID = req.params.id;

        await BlockService.unblockUser(req.user!, blockID);

        return res.send();
    }
}
