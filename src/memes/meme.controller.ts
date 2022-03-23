import { Request, Response } from 'express-serve-static-core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { AuthMiddleware, Controller } from '../common';
import { MemeService, PostMemeDto } from '.';

export class MemeController extends Controller {
    constructor() {
        super('/meme');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('', this.getAllMemes);
        router.post('', this.postMeme);
    }

    async getAllMemes(req: Request, res: Response) {
        if (!req.session.userID) {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }
        const memes = await MemeService.getAllMemes();
        res.send(instanceToPlain(memes));
    }

    async postMeme(req: Request, res: Response) {
        const body = plainToInstance(PostMemeDto, req.body as PostMemeDto);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const meme = await MemeService.postMeme(body);

        res.status(StatusCodes.CREATED).json(instanceToPlain(meme));
    }
}
