import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthMiddleware, Controller, validate } from '../common';
import { AdminMiddleware } from '../common/middlewares/admin.middleware';
import { AddGameDto, AddLevelDto, GameService } from '.';

export class GameController extends Controller {
    constructor() {
        super('/game');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getAllGames);
        router.post('/', AdminMiddleware, this.addGame);
        router.get('/:id', this.getGame);
        router.delete('/:id', AdminMiddleware, this.removeGame);
        router.post('/:id/level', AdminMiddleware, this.addExperienceLevel);
        router.delete(
            '/:id/level/:lvl_id',
            AdminMiddleware,
            this.removeExperienceLevel
        );
    }

    async getAllGames(req: Request, res: Response) {
        return res.send(await GameService.getAllGames());
    }

    async getGame(req: Request, res: Response) {
        const gameID = req.params.id;
        const game = await GameService.getGame(gameID);
        return res.json(instanceToPlain(game));
    }

    async addGame(req: Request, res: Response) {
        const body = validate(AddGameDto, req.body);

        const added = await GameService.addGame(body);

        return res.status(StatusCodes.CREATED).send(instanceToPlain(added));
    }

    async removeGame(req: Request, res: Response) {
        const gameID = req.params.id;
        await GameService.removeGame(gameID);
        return res.send();
    }

    async addExperienceLevel(req: Request, res: Response) {
        const body = validate(AddLevelDto, req.body);

        const gameID = req.params.id;
        const added = await GameService.addExperienceLevel(gameID, body);

        return res.status(StatusCodes.CREATED).send(instanceToPlain(added));
    }

    async removeExperienceLevel(req: Request, res: Response) {
        const gameID = req.params.id;
        const lvlID = req.params.lvl_id;

        await GameService.removeExperienceLevel(gameID, lvlID);

        return res.send();
    }
}
