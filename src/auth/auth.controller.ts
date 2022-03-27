import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';

import { AuthMiddleware, Controller, LoggedOutMiddleware } from '../common';
import { UserService } from '../user';
import {
    AuthService,
    PasswordResetDto,
    PasswordResetRequestDto,
    RegisterDto
} from '.';

export class AuthController extends Controller {
    constructor() {
        super('/auth');

        const router = this.getRouter();

        router.post(
            '/login',
            LoggedOutMiddleware,
            passport.authenticate('local'),
            this.login
        );
        router.post('/register', LoggedOutMiddleware, this.register);
        router.post('/logout', AuthMiddleware, this.logout);
        router.get('/websocket-jwt', AuthMiddleware, this.websocketJWT);

        router.get('/activate/:id', LoggedOutMiddleware, this.activateUser);
        router.post(
            '/request-password-reset',
            LoggedOutMiddleware,
            this.requestPasswordReset
        );
        router.get(
            '/password-reset/:id',
            LoggedOutMiddleware,
            this.resetPassword
        );
    }

    login(req: Request, res: Response) {
        res.send(instanceToPlain(req.user));
    }

    async register(req: Request, res: Response) {
        const body = plainToInstance(RegisterDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const user = await AuthService.register(body);

        if (!user) {
            return res.status(StatusCodes.CONFLICT).send();
        }

        return res.json(instanceToPlain(user));
    }

    logout(req: Request, res: Response) {
        req.session.destroy(() => {
            res.send();
        });
    }

    websocketJWT(req: Request, res: Response) {
        return res.send(AuthService.getWebsocketJWT(req.user!.id));
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
