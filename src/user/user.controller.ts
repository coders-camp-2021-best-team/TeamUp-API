import { Request, Response } from 'express';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Controller } from '../common';
import { UserService, UpdateUserDto } from '.';
import { StatusCodes } from 'http-status-codes';

export class UserController extends Controller {
    constructor() {
        super('/user');

        const router = this.getRouter();

        router.get('/:id', this.getUser);
        router.put('/:id', this.updateUser);
        router.patch('/activate/:id', this.activateUser);
        router.post(
            '/request-password-reset/:email',
            this.requestPasswordReset
        );
    }

    async getUser(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const user = await UserService.getUser(id);

            if (!user) {
                return res.status(404).send('Not Found');
            }
            return res.status(200).json(instanceToPlain(user));
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }

    async updateUser(req: Request, res: Response) {
        const body = plainToInstance(UpdateUserDto, req.body as UpdateUserDto);
        const errors = await validate(body);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const id = req.params.id;

        const created = await UserService.updateUser(id, body);

        res.send(instanceToPlain(created));
    }

    async activateUser(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const isActivated = await UserService.activateUser(id); /// truthy or falsy

            if (isActivated) {
                res.status(StatusCodes.OK).json({
                    message: 'success',
                    isActivated
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'bad request',
                    isActivated
                });
            }
        } catch {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'server error'
            });
        }
    }

    async requestPasswordReset(req: Request, res: Response) {
        const email = req.params.email;

        try {
            await UserService.requestPasswordReset(email);

            res.status(200).json({
                msg: 'If the user with the given e-mail exists, we have sent a link to change the password'
            });
        } catch {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'server error'
            });
        }
    }
}
