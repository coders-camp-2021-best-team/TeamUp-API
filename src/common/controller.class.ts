import { Router } from 'express';

export abstract class Controller {
    private router = Router();

    constructor(private base_path: string) {}

    public getBasePath() {
        return this.base_path;
    }

    public getRouter() {
        return this.router;
    }
}
