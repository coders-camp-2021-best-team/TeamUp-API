import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import { AuthMiddleware, Controller, validate } from '../common';
import { CreateVoteDto, PostVoteService } from '.';

export class PostVoteController extends Controller {
    constructor() {
        super('/');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/:id/vote', this.getVotes);
        router.post('/:id/vote', this.createVote);
        router.delete('/:id/vote', this.removeVote);
    }

    async getVotes(req: Request, res: Response) {
        const postID = req.params.id;

        const vote_data = await PostVoteService.getVotes(req.user!, postID);

        res.send(instanceToPlain(vote_data));
    }

    async createVote(req: Request, res: Response) {
        const postID = req.params.id;

        const body = validate(CreateVoteDto, req.body);

        await PostVoteService.createVote(req.user!, postID, body);

        const vote_data = await PostVoteService.getVotes(req.user!, postID);

        res.send(instanceToPlain(vote_data));
    }

    async removeVote(req: Request, res: Response) {
        const postID = req.params.id;

        await PostVoteService.removeVote(req.user!, postID);

        res.send();
    }
}
