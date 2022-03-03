import { Request, Response } from 'express';
import { IsNotEmpty, IsString, validate } from 'class-validator';
import { Controller } from '../common/controller.class';
import { UserService } from './user-service';

class GreetBody {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UserController extends Controller {
    constructor() {
        super('/users');

        const router = this.getRouter();

        router.get('/:id', this.getUser);
        router.put('/:id', this.getAllGreetings);
    }

    //     // Route to return all articles with a given tag
    // app.get('/tag/:id', async function(req, res) {

    //     // Retrieve the tag from our URL path
    //     var id = req.params.id;

    //     let articles = await Article.findAll({tag: id}).exec();

    //     res.render('tag', {
    //         articles: articles
    //     });
    // });

    async getUser(
        req: Request<Record<string, never>, Record<string, never>, GreetBody>,
        res: Response
    ) {
        const body = new GreetBody();
        body.id = req.body.id;
        body.name = req.body.name;
        const errors = await validate(body);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const greeting = await UserService.getUser(req.params.id);

        if (!greeting) {
            return res.status(404).send('Not Found');
        }

        return res.send(greeting);
    }

    async getAllGreetings(req: Request, res: Response) {
        res.send(await HelloWorldService.getAllGreetings());
    }

    async createGreeting(
        req: Request<unknown, unknown, GreetingDto>,
        res: Response
    ) {
        const data = new GreetingDto();
        data.text = req.body.text;
        const errors = await validate(data);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const created = await HelloWorldService.createGreeting(data);

        res.send(created);
    }
}
