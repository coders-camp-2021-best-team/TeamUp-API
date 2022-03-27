import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import { AuthMiddleware, Controller, ForbiddenException } from '../common';
import { UserSkillService } from '.';

export class UserSkillController extends Controller {
    constructor() {
        super('/');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.put('/:id/skill/:levelID', this.addUserSkill);
        router.delete('/:id/skill/:skillID', this.removeUserSkill);
    }

    async addUserSkill(req: Request, res: Response) {
        const userID = req.params.id;
        const levelID = req.params.levelID;

        if (userID !== req.user!.id) throw new ForbiddenException();

        const skills = await UserSkillService.addUserSkill(req.user!, levelID);

        return res.send(instanceToPlain(skills));
    }

    async removeUserSkill(req: Request, res: Response) {
        const userID = req.params.id;
        const skillID = req.params.skillID;

        if (userID !== req.user!.id) throw new ForbiddenException();

        await UserSkillService.removeUserSkill(req.user!, skillID);

        res.send();
    }
}
