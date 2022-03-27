import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthMiddleware, Controller } from '../common';
import {
    CreatePostDto,
    PostAttachmentController,
    PostCategoryController,
    PostService,
    PostVoteController,
    QueryPostDto,
    UpdatePostDto
} from '.';

export class PostController extends Controller {
    constructor() {
        super('/post', [
            new PostCategoryController(),
            new PostVoteController(),
            new PostAttachmentController()
        ]);

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getPosts);
        router.post('/', this.createPost);
        router.put('/:id', this.updatePost);
        router.delete('/:id', this.removePost);
    }

    async getPosts(req: Request, res: Response) {
        const query = plainToInstance(QueryPostDto, req.query);
        const errors = validateSync(query);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const posts = await PostService.getPosts(query);

        if (!posts) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        res.send(instanceToPlain(posts));
    }

    async createPost(req: Request, res: Response) {
        const body = plainToInstance(CreatePostDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const post = await PostService.createPost(req.user!.id, body);

        if (!post) {
            return res.status(StatusCodes.FORBIDDEN).send();
        }

        return res.send(instanceToPlain(post));
    }

    async updatePost(req: Request, res: Response) {
        const body = plainToInstance(UpdatePostDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const postID = req.params.id;

        const updated = await PostService.updatePost(
            req.user!.id,
            postID,
            body
        );

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send(instanceToPlain(updated));
    }

    async removePost(req: Request, res: Response) {
        const postID = req.params.id;

        const removed = await PostService.removePost(req.user!.id, postID);

        if (!removed) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send();
    }
}
