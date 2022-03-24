import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AuthMiddleware, Controller } from '../common';
import {
    UserService,
    UpdateUserDto,
    UserPhotoController,
    UserAvatarController
} from '.';

export class UserController extends Controller {
    constructor() {
        super('/user', [new UserAvatarController(), new UserPhotoController()]);

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/:id', this.getUser);
        router.put('/:id', this.updateUser);
        router.put('/:id/skill/:levelID', this.addUserSkill);
        router.delete('/:id/skill/:skillID', this.removeUserSkill);
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
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        return res.send(instanceToPlain(updated));
    }

    async addUserSkill(req: Request, res: Response) {
        const userID = req.params.id;
        const levelID = req.params.levelID;

        if (!userID || userID !== req.session.userID) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        const skills = await UserService.addUserSkill(userID, levelID);

        if (!skills) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        return res.send(instanceToPlain(skills));
    }

    async removeUserSkill(req: Request, res: Response) {
        const userID = req.params.id;
        const skillID = req.params.skillID;

        if (!userID || userID !== req.session.userID) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        const removed = await UserService.removeUserSkill(userID, skillID);

        if (!removed) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send();
    }
}
