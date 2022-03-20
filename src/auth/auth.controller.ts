import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthMiddleware, LoggedOutMiddleware, Controller } from '../common';
import { UserStatus } from '../user';
import { AuthService, LoginDto, RegisterDto } from '.';

export class AuthController extends Controller {
    constructor() {
        super('/auth');

        const router = this.getRouter();

        router.post('/login', LoggedOutMiddleware, this.login);
        router.post('/register', LoggedOutMiddleware, this.register);
        router.post('/logout', AuthMiddleware, this.logout);
    }

    async login(req: Request, res: Response) {
        const body = plainToInstance(LoginDto, req.body);
        const errors = await validate(body);
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
        const errors = await validate(body);
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
}
