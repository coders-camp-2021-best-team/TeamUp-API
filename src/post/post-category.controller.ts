import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthMiddleware, Controller } from '../common';
import { AdminMiddleware } from '../common/middlewares/admin.middleware';
import {
    PostCategoryService,
    QueryPostDto,
    CreateCategoryDto,
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
        const query = plainToInstance(QueryPostDto, req.query);
        const errors = validateSync(query);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const posts = await PostCategoryService.getCategories(query);

        if (!posts) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        res.send(instanceToPlain(posts));
    }

    async createCategory(req: Request, res: Response) {
        const body = plainToInstance(CreateCategoryDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const post = await PostCategoryService.createCategory(body);

        if (!post) {
            return res.status(StatusCodes.FORBIDDEN).send();
        }

        return res.send(instanceToPlain(post));
    }

    async updateCategory(req: Request, res: Response) {
        const body = plainToInstance(UpdateCategoryDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const postID = req.params.id;

        const updated = await PostCategoryService.updateCategory(postID, body);

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send(instanceToPlain(updated));
    }

    async removeCategory(req: Request, res: Response) {
        const postID = req.params.id;

        const removed = await PostCategoryService.removeCategory(postID);

        if (!removed) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send();
    }
}
