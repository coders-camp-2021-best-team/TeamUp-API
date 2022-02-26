import express from 'express';
import { Middleware, Controller } from '.';

import logger from '../logger';
import env from '../config';
const { PORT } = env;

export class API {
    private app = express();
    private middlewares: Middleware[];
    private controllers: Controller[];

    constructor(options: {
        middlewares: Middleware[];
        controllers: Controller[];
    }) {
        this.middlewares = options.middlewares;
        this.controllers = options.controllers;
    }

    private initMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.middlewares.forEach((middleware) => {
            this.app.use(middleware);

            logger.info(`middleware: ${middleware.name} initialized`);
        });
    }

    private initControllers() {
        this.controllers.forEach((controller) => {
            this.app.use(controller.getBasePath(), controller.getRouter());

            logger.info(
                `controller: ${controller.constructor.name} initialized`
            );
        });
    }

    public initialize() {
        this.initMiddlewares();
        this.initControllers();

        this.app.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`);
        });
    }
}
