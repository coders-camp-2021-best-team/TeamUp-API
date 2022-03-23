import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AuthMiddleware, Controller } from '../common';
import {
    UserService,
    UpdateUserDto,
    PasswordResetRequestDto,
    PasswordResetDto
} from '.';

export class UserController extends Controller {
    constructor() {
        super('/user');

        const router = this.getRouter();

        router.get('/:id', AuthMiddleware, this.getUser);
        router.put('/:id', AuthMiddleware, this.updateUser);
        router.get('/activate/:id', this.activateUser);
        router.post('/request-password-reset', this.requestPasswordReset);
        router.get('/password-reset/:id', this.resetPassword);
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
        const errors = validateSync(body);
        if (errors.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
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

    async activateUser(req: Request, res: Response) {
        const id = req.params.id;
        const user = await UserService.activateUser(id);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        return res.send();
    }

    async requestPasswordReset(req: Request, res: Response) {
        const body = plainToInstance(PasswordResetRequestDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const email = body.email;

        await UserService.requestPasswordReset(email);

        return res.send();
    }

    async resetPassword(req: Request, res: Response) {
        const body = plainToInstance(PasswordResetDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const id = req.params.id;
        const password = body.password;

        const user = await UserService.resetPassword(id, password);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        return res.send();
    }
}
