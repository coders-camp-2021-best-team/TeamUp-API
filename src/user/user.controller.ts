import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { Controller } from '../common/controller.class';
import { UserService } from './user-service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
export class UserController extends Controller {
    constructor() {
        super('/user');

        const router = this.getRouter();

        router.get('/:id', this.getUser);
        router.put('/:id', this.updateUser);
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

        const userToUpdate = body;

        const id = req.params.id;

        const created = await UserService.updateUser(id, userToUpdate);

        res.send(instanceToPlain(created));
    }
}
