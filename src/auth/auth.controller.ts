import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Controller } from '../common';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

export class AuthController extends Controller {
    constructor() {
        super('/auth');

        const router = this.getRouter();

        router.post('/login', this.login);
        router.post('/register', this.register);
        router.post('/logout', this.logout);
    }

    async login(req: Request, res: Response) {
        const body = plainToInstance(LoginDto, req.body as LoginDto);
        const errors = await validate(body);
        if (errors.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const user = await AuthService.login(body);

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }

        req.session.userID = user.id;

        return res.json(instanceToPlain(user));
    }

    async register(req: Request, res: Response) {
        const body = plainToInstance(RegisterDto, req.body as RegisterDto);
        const errors = await validate(body);
        if (errors.length > 0) {
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
