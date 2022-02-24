import { IsNotEmpty, IsString, validate } from 'class-validator';
import { Request, Response } from 'express';
import { GreetingDto } from './greeting.dto';
import { HelloWorldService } from './hello-world.service';

class GreetBody {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}

export const HelloWorldController = new (class {
    async greet(req: Request<unknown, unknown, GreetBody>, res: Response) {
        const body = new GreetBody();
        body.id = req.body.id;
        body.name = req.body.name;
        const errors = await validate(body);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const greeting = await HelloWorldService.greet(body.id, body.name);

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
})();
