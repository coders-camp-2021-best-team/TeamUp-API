import express from 'express';
import session from 'express-session';
import ConnectRedis from 'connect-redis';
import { createClient } from 'redis';
import { Middleware, Controller } from '.';

import logger from '../logger';
import env from '../config';
const { PORT, SESSION_SECRET, REDIS_URL, REDIS_TLS_URL } = env;

const RedisStore = ConnectRedis(session);

declare module 'express-session' {
    interface SessionData {
        userID: string;
    }
}

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

    private initSession() {
        const redisClient = createClient({
            url: REDIS_URL || REDIS_TLS_URL,
            legacyMode: true
        });

        redisClient.connect();

        this.app.use(
            session({
                store: new RedisStore({
                    client: redisClient
                }),
                saveUninitialized: false,
                secret: SESSION_SECRET,
                resave: false,
                cookie: {
                    httpOnly: true
                }
            })
        );
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
        this.initSession();
        this.initMiddlewares();
        this.initControllers();

        this.app.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`);
        });
    }
}
