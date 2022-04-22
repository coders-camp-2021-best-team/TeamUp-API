import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import passport from 'passport';

import {
    AuthMiddleware,
    Controller,
    LoggedOutMiddleware,
    validate
} from '../common';
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
        router.post(
            '/password-reset/:id',
            LoggedOutMiddleware,
            this.resetPassword
        );
    }

    login(req: Request, res: Response) {
        res.send(instanceToPlain(req.user));
    }

    async register(req: Request, res: Response) {
        const body = validate(RegisterDto, req.body);

        const user = await AuthService.register(body);

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

        await AuthService.activateUser(id);

        return res.send();
    }

    async requestPasswordReset(req: Request, res: Response) {
        const { email } = validate(PasswordResetRequestDto, req.body);

        await AuthService.requestPasswordReset(email);

        return res.send();
    }

    async resetPassword(req: Request, res: Response) {
        const id = req.params.id;
        const { password } = validate(PasswordResetDto, req.body);

        await AuthService.resetPassword(id, password);

        return res.send();
    }
}
