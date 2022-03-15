import { Request, Response } from 'express';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Controller } from '../common';
import { GameService, AddGameDto, AddLevelDto } from '.';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { gameMiddleware } from '../common';

export class GameController extends Controller {
    constructor() {
        super('/game');

        const router = this.getRouter();

        router.get('/', this.getAllGames);
        router.post('/', this.addGame);
        router.get('/:id', this.getGame);
        router.delete('/:id', this.removeGame);
        router.post('/:id/experience', gameMiddleware, this.addExperienceLevel);
        router.delete(
            '/:id/experience/:lvl_id',
            gameMiddleware,
            this.removeExperienceLevel
        );
    }

    async getAllGames(req: Request, res: Response) {
        return res.send(await GameService.getAllGames());
    }

    async getGame(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const game = await GameService.getGame(id);

            if (!game) {
                return res.status(StatusCodes.NOT_FOUND).send('Game not found');
            }
            return res.json(instanceToPlain(game));
        } catch (error) {
            console.error(error);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
    }

    async addGame(req: Request, res: Response) {
        const body = plainToInstance(AddGameDto, req.body as AddGameDto);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const added = await GameService.addGame(body);

        return res.status(StatusCodes.CREATED).send(instanceToPlain(added));
    }

    async removeGame(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const removed = await GameService.removeGame(id);

            if (!removed) {
                return res.status(StatusCodes.NOT_FOUND).send('Game not found');
            }
            return res
                .status(StatusCodes.NO_CONTENT)
                .send('Game has been removed');
        } catch (error) {
            console.error(error);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
    }

    async addExperienceLevel(req: Request, res: Response) {
        const body = plainToInstance(AddLevelDto, req.body as AddLevelDto);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const added = await GameService.addExperienceLevel(body);

        return res.status(StatusCodes.CREATED).send(instanceToPlain(added));
    }

    async removeExperienceLevel(req: Request, res: Response) {
        const id = req.params.lvl_id;

        try {
            const removed = await GameService.removeExperienceLevel(id);

            if (!removed) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .send('Experience level not found');
            }
            return res
                .status(StatusCodes.NO_CONTENT)
                .send('Experience level has been removed');
        } catch (error) {
            console.error(error);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
    }
}
