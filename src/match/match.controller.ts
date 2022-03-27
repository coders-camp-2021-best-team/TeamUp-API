import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthMiddleware, Controller } from '../common';
import { MatchService } from './match.service';

export class MatchController extends Controller {
    constructor() {
        super('/match');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getMatch);
    }

    async getMatch(req: Request, res: Response) {
        const match = await MatchService.getMatch(req.user!.id);

        if (!match) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send(instanceToPlain(match));
    }
}
