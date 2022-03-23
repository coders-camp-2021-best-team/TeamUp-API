import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthMiddleware, Controller } from '../common';
import { CreateVoteDto, PostVoteService } from '.';

export class PostVoteController extends Controller {
    constructor() {
        super('/:id/vote');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getVotes);
        router.post('/', this.createVote);
        router.delete('/', this.removeVote);
    }

    async getVotes(req: Request, res: Response) {
        const postID = req.params.id;

        const vote_data = await PostVoteService.getVotes(
            req.session.userID || '',
            postID
        );

        if (!vote_data) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send(instanceToPlain(vote_data));
    }

    async createVote(req: Request, res: Response) {
        const postID = req.params.id;

        const body = plainToInstance(CreateVoteDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const vote = await PostVoteService.createVote(
            req.session.userID || '',
            postID,
            body
        );

        if (!vote) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        const vote_data = await PostVoteService.getVotes(
            req.session.userID || '',
            postID
        );

        if (!vote_data) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send(instanceToPlain(vote_data));
    }

    async removeVote(req: Request, res: Response) {
        const postID = req.params.id;

        const vote = await PostVoteService.removeVote(
            req.session.userID || '',
            postID
        );

        if (!vote) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send();
    }
}
