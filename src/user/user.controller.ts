import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import {
    AuthMiddleware,
    Controller,
    ForbiddenException,
    validate
} from '../common';
import {
    UpdateUserDto,
    UserAvatarController,
    UserPhotoController,
    UserService,
    UserSkillController
} from '.';

export class UserController extends Controller {
    constructor() {
        super('/user', [
            new UserAvatarController(),
            new UserPhotoController(),
            new UserSkillController()
        ]);

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/:id', this.getUser);
        router.put('/:id', this.updateUser);
    }

    async getUser(req: Request, res: Response) {
        const id = req.params.id;

        const user = await UserService.getUser(id == '@me' ? req.user!.id : id);

        return res.send(instanceToPlain(user));
    }

    async updateUser(req: Request, res: Response) {
        const id = req.params.id;
        const body = validate(UpdateUserDto, req.body);

        if (id !== req.user!.id) throw new ForbiddenException();

        const updated = await UserService.updateUser(req.user!, body);

        return res.send(instanceToPlain(updated));
    }
}
