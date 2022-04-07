import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import { AuthMiddleware, Controller, validate } from '../common';
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
        const query = validate(QueryPostDto, req.query);

        const posts = await PostService.getPosts(query);

        res.send(instanceToPlain(posts));
    }

    async createPost(req: Request, res: Response) {
        const body = validate(CreatePostDto, req.body);

        const post = await PostService.createPost(req.user!, body);

        return res.send(instanceToPlain(post));
    }

    async updatePost(req: Request, res: Response) {
        const body = validate(UpdatePostDto, req.body);
        const postID = req.params.id;

        const updated = await PostService.updatePost(req.user!, postID, body);

        res.send(instanceToPlain(updated));
    }

    async removePost(req: Request, res: Response) {
        const postID = req.params.id;

        await PostService.removePost(req.user!, postID);

        res.send();
    }
}
