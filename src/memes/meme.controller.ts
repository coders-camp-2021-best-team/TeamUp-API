import { Request, Response } from 'express-serve-static-core';
import { Controller } from '../common';
import { MemeService } from './meme.service';

export class MemeController extends Controller {
    constructor() {
        super('/meme');

        const router = this.getRouter();

        router.get('', this.getAllMemes);
    }
    async getAllMemes(req: Request, res: Response) {
        res.send(await MemeService.getAllMemes());
    }
}
