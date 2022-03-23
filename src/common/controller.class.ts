import { Router } from 'express';
import logger from '../logger';

export abstract class Controller {
    private router = Router();

    constructor(private base_path: string, private controllers?: Controller[]) {
        this.controllers?.forEach((controller) => {
            this.router.use(controller.getBasePath(), controller.getRouter());

            logger.info(
                `controller: ${controller.constructor.name} initialized`
            );
        });
    }

    public getBasePath() {
        return this.base_path;
    }

    public getRouter() {
        return this.router;
    }
}
