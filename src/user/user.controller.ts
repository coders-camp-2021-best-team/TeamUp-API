import { Request, Response } from 'express';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthMiddleware, Controller } from '../common';
import { UserService, UpdateUserDto, PasswordResetDto } from '.';
import { StatusCodes } from 'http-status-codes';

export class UserController extends Controller {
    constructor() {
        super('/user');

        const router = this.getRouter();

        router.use(AuthMiddleware);
        router.get('/:id', this.getUser);
        router.put('/:id', this.updateUser);
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
        const errors = await validate(body);
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
        try {
            const isActivated = await UserService.activateUser(id);

            if (isActivated) {
                res.status(StatusCodes.OK).json({
                    message: 'User activated',
                    isActivated
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'User not found',
                    isActivated
                });
            }
        } catch {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Server error'
            });
        }
    }

    async requestPasswordReset(req: Request, res: Response) {
        const body = plainToInstance(PasswordResetDto, req.body);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const email = body.email;

        await UserService.requestPasswordReset(email);

        res.status(StatusCodes.OK).json({
            msg: 'If the user with the given e-mail exists, we have sent a link to change the password'
        });
    }

    async resetPassword(req: Request, res: Response) {
        const id = req.params.id;
        const password = req.body.password;

        try {
            const user = await UserService.resetPassword(id, password);
            if (user) {
                res.status(StatusCodes.OK).json({
                    msg: 'Password changed'
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    msg: 'User not found'
                });
            }
        } catch {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Server error'
            });
        }
    }
}
