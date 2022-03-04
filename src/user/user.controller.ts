import { Request, Response } from 'express';
import { IsNotEmpty, IsString, validate } from 'class-validator';
import { Controller } from '../common/controller.class';
import { UserService } from './user-service';

// class GreetBody {
//     @IsString()
//     @IsNotEmpty()
//     id: string;

//     @IsString()
//     @IsNotEmpty()
//     name: string;
// }

export class UserController extends Controller {
    constructor() {
        super('/users');

        const router = this.getRouter();

        router.get('/:id', this.getUser);
        router.put('/:id', this.updateUser);
    }

    async getUser(
        req: Request<Record<string, never>, Record<string, never>>,
        res: Response
    ) {
        const id = req.params.id;

        try {
            const user = await UserService.getUser(id);

            if (!user) {
                return res.status(404).send('Not Found');
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }

    async updateUser(
        req: Request<
            Record<string, never>,
            Record<string, never>,
            { name: string; age: number }
        >,
        res: Response
    ) {
        // const data = new GreetingDto();
        // data.text = req.body.text;
        // const errors = await validate(data);
        // if (errors.length > 0) {
        //     return res.status(400).json(errors);
        // }

        const userToUpdate = req.body;

        const id = req.params.id;

        const created = await UserService.updateUser(id, userToUpdate);

        res.send(created);
    }
}
