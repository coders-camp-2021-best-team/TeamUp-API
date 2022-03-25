import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthMiddleware, Controller, LoggedOutMiddleware } from '../common';
import { UserService, UserStatus } from '../user';
import {
    AuthService,
    LoginDto,
    PasswordResetDto,
    PasswordResetRequestDto,
    RegisterDto
} from '.';

export class AuthController extends Controller {
    constructor() {
        super('/auth');

        const router = this.getRouter();

        router.post('/login', LoggedOutMiddleware, this.login);
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

    async login(req: Request, res: Response) {
        const body = plainToInstance(LoginDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const user = await AuthService.login(body);

        if (!user || user.status !== UserStatus.ACTIVE) {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }

        req.session.userID = user.id;
        req.session.loggedIn = true;

        return res.json(instanceToPlain(user));
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
        if (!req.session.userID) {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }

        return res.send(AuthService.getWebsocketJWT(req.session.userID));
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
