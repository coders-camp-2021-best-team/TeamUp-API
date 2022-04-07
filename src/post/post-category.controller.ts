import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import { AuthMiddleware, Controller, validate } from '../common';
import { AdminMiddleware } from '../common/middlewares/admin.middleware';
import {
    CreateCategoryDto,
    PostCategoryService,
    QueryPostDto,
    UpdateCategoryDto
} from '.';

export class PostCategoryController extends Controller {
    constructor() {
        super('/category');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getCategories);
        router.post('/', AdminMiddleware, this.createCategory);
        router.put('/:id', AdminMiddleware, this.updateCategory);
        router.delete('/:id', AdminMiddleware, this.removeCategory);
    }

    async getCategories(req: Request, res: Response) {
        const query = validate(QueryPostDto, req.query);

        const posts = await PostCategoryService.getCategories(query);

        res.send(instanceToPlain(posts));
    }

    async createCategory(req: Request, res: Response) {
        const body = validate(CreateCategoryDto, req.body);

        const post = await PostCategoryService.createCategory(body);

        return res.send(instanceToPlain(post));
    }

    async updateCategory(req: Request, res: Response) {
        const postID = req.params.id;
        const body = validate(UpdateCategoryDto, req.body);

        const updated = await PostCategoryService.updateCategory(postID, body);

        return res.send(instanceToPlain(updated));
    }

    async removeCategory(req: Request, res: Response) {
        const postID = req.params.id;

        await PostCategoryService.removeCategory(postID);

        return res.send();
    }
}
