import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthMiddleware, Controller } from '../common';
import { GameService, AddGameDto, AddLevelDto } from '.';

export class GameController extends Controller {
    constructor() {
        super('/game');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getAllGames);
        router.post('/', this.addGame);
        router.get('/:id', this.getGame);
        router.delete('/:id', this.removeGame);
        router.get('/:id/level', this.getExperienceLevel);
        router.post('/:id/level', this.addExperienceLevel);
        router.delete('/:id/level/:lvl_id', this.removeExperienceLevel);
    }

    async getAllGames(req: Request, res: Response) {
        const userID = req.session.id;
        const game = await GameService.getUserGames(userID);

        if (!game) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }
    }

    async getGame(req: Request, res: Response) {
        const userID = req.session.id;
        const gameID = req.params.id;
        const game = await GameService.getGame(userID, gameID);

        if (!game) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }
        return res.json(instanceToPlain(game));
    }

    async addGame(req: Request, res: Response) {
        const userID = req.session.id;
        const body = plainToInstance(AddGameDto, req.body as AddGameDto);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const added = await GameService.addGame(userID, body);

        if (!added) {
            return res.status(StatusCodes.CONFLICT).send();
        }
        return res.status(StatusCodes.CREATED).send(instanceToPlain(added));
    }

    async removeGame(req: Request, res: Response) {
        const userID = req.session.id;
        const gameID = req.params.id;

        const removed = await GameService.removeGame(userID, gameID);

        if (!removed) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }
        return res.send();
    }

    async getExperienceLevel(req: Request, res: Response) {
        const userID = req.session.id;
        const gameID = req.params.id;

        const level = await GameService.getExperienceLevel(userID, gameID);

        if (!level) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }
        return res.send(level);
    }

    async addExperienceLevel(req: Request, res: Response) {
        const userID = req.session.id;
        const body = plainToInstance(AddLevelDto, req.body as AddLevelDto);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const gameID = req.params.id;
        const added = await GameService.addExperienceLevel(
            userID,
            gameID,
            body
        );

        if (!added) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }
        return res.status(StatusCodes.CREATED).send(instanceToPlain(added));
    }

    async removeExperienceLevel(req: Request, res: Response) {
        const userID = req.session.id;
        const gameID = req.params.id;
        const lvlID = req.params.lvl_id;

        const removed = await GameService.removeExperienceLevel(
            userID,
            gameID,
            lvlID
        );

        if (!removed) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }
        return res.send();
    }
}
