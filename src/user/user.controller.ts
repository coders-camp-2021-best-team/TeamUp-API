import { Request, Response } from 'express';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthMiddleware, Controller } from '../common';
import { UserService, UpdateUserDto } from '.';
import { StatusCodes } from 'http-status-codes';

export class UserController extends Controller {
    constructor() {
        super('/user');

        const router = this.getRouter();

        router.use(AuthMiddleware);
        router.get('/:id', this.getUser);
        router.put('/:id', this.updateUser);
    }

    async getUser(req: Request, res: Response) {
        const id = req.params.id;

        const user = await UserService.getUser(id);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        return res.send(instanceToPlain(user));
    }

    async updateUser(req: Request, res: Response) {
        const body = plainToInstance(UpdateUserDto, req.body);
        const errors = await validate(body);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const id = req.params.id;

        if (id !== req.session.userID) {
            return res.status(StatusCodes.FORBIDDEN).send();
        }

        const updated = await UserService.updateUser(id, body);

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        return res.send(instanceToPlain(updated));
    }
}
