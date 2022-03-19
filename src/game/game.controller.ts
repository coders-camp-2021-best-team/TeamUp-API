import { Request, Response } from 'express';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Controller } from '../common';
import { GameService, AddGameDto, AddLevelDto } from '.';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export class GameController extends Controller {
    constructor() {
        super('/game');

        const router = this.getRouter();

        router.get('/', this.getAllGames);
        router.post('/', this.addGame);
        router.get('/:id', this.getGame);
        router.delete('/:id', this.removeGame);
        router.get('/:id/level', this.getExperienceLevels);
        router.post('/:id/level', this.addExperienceLevel);
        router.delete('/:id/level/:lvl_id', this.removeExperienceLevel);
    }

    async getAllGames(req: Request, res: Response) {
        return res.send(await GameService.getAllGames());
    }

    async getGame(req: Request, res: Response) {
        const id = req.params.id;

        const game = await GameService.getGame(id);

        if (!game) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send(ReasonPhrases.NOT_FOUND);
        }
        return res.json(instanceToPlain(game));
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

        const removed = await GameService.removeGame(id);

        if (!removed) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send(ReasonPhrases.NOT_FOUND);
        }
        return res.send();
    }

    async getExperienceLevels(req: Request, res: Response) {
        const game_id = req.params.id;

        const game = await GameService.getGame(game_id);

        if (!game) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send(ReasonPhrases.NOT_FOUND);
        }
        const levels = await GameService.getExperienceLevels(game_id);

        if (!levels) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send(ReasonPhrases.NOT_FOUND);
        }

        return res.send(levels);
    }

    async addExperienceLevel(req: Request, res: Response) {
        const game_id = req.params.id;

        const game = await GameService.getGame(game_id);

        if (!game) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send(ReasonPhrases.NOT_FOUND);
        }

        const body = plainToInstance(AddLevelDto, req.body as AddLevelDto);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const added = await GameService.addExperienceLevel(game_id, body);

        return res.status(StatusCodes.CREATED).send(instanceToPlain(added));
    }

    async removeExperienceLevel(req: Request, res: Response) {
        const game_id = req.params.id;
        const lvl_id = req.params.lvl_id;

        const game = await GameService.getGame(game_id);

        if (!game) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send(ReasonPhrases.NOT_FOUND);
        }

        const removed = await GameService.removeExperienceLevel(
            game_id,
            lvl_id
        );

        if (!removed) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send(ReasonPhrases.NOT_FOUND);
        }
        return res.send();
    }
}
