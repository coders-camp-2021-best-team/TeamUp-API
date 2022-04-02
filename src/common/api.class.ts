import 'express-async-errors';

import ConnectRedis from 'connect-redis';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import RateLimiter from 'express-rate-limit';
import session from 'express-session';
import SlowDown from 'express-slow-down';
import { createServer } from 'http';
import { StatusCodes } from 'http-status-codes';
import Redis from 'ioredis';
import passport from 'passport';
import { Server } from 'socket.io';
import { createConnection, getConnectionOptions } from 'typeorm';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';

import { AuthService } from '../auth';
import {
    Controller,
    HttpException,
    Middleware,
    WebsocketConnectionHandler,
    WebsocketMiddleware
} from '../common';
import env from '../config';
import logger from '../logger';
import { User as DBUser } from '../user';
const { NODE_ENV, PORT, SESSION_SECRET, REDIS_URL, REDIS_TLS_URL, CLIENT_URL } =
    env;

const RedisStore = ConnectRedis(session);

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface User extends DBUser {}
    }
}

export class API {
    private app = express();
    private http = createServer(this.app);
    private io = new Server(this.http);

    private session_middleware: express.RequestHandler;
    private middlewares: Middleware[];
    private controllers: Controller[];
    private passportStrategies: passport.Strategy[];
    private onWebsocketConnection: WebsocketConnectionHandler;
    private websocketMiddleware: WebsocketMiddleware;

    constructor(options: {
        middlewares: Middleware[];
        controllers: Controller[];
        passportStrategies: passport.Strategy[];
        onWebsocketConnection: WebsocketConnectionHandler;
        websocketMiddleware: WebsocketMiddleware;
    }) {
        this.middlewares = options.middlewares;
        this.controllers = options.controllers;
        this.passportStrategies = options.passportStrategies;
        this.onWebsocketConnection = options.onWebsocketConnection;
        this.websocketMiddleware = options.websocketMiddleware;
    }

    private async initDatabase() {
        const options = await getConnectionOptions();

        await createConnection({
            logger: new WinstonAdaptor(logger, 'all'),
            ...options
        });
    }

    private initCORS() {
        this.app.use(
            cors({
                origin: CLIENT_URL
            })
        );
    }

    private initSession() {
        const redis_client = new Redis(REDIS_TLS_URL || REDIS_URL, {
            tls: REDIS_TLS_URL
                ? {
                      requestCert: true,
                      rejectUnauthorized: false
                  }
                : undefined
        });

        this.session_middleware = session({
            store: new RedisStore({
                client: redis_client
            }),
            saveUninitialized: false,
            secret: SESSION_SECRET,
            resave: false,
            cookie: {
                httpOnly: true,
                secure: 'auto'
            }
        });

        this.app.use(this.session_middleware);
    }

    private initRateLimiter() {
        // 600 req/min
        const limit = 600;
        const ms = 60 * 1000;
        const speed_limit_on_usage = 0.8;

        const rateLimiter = RateLimiter({
            max: limit,
            windowMs: ms,
            standardHeaders: true,
            legacyHeaders: false
        });

        const speedLimiter = SlowDown({
            windowMs: ms,
            delayAfter: speed_limit_on_usage * limit,
            delayMs: 100,
            headers: true
        });

        this.app.use(rateLimiter);
        this.app.use(speedLimiter);
    }

    private initPassport() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        passport.serializeUser((user, done) => done(null, user.id));

        passport.deserializeUser(async (id: string, done) => {
            try {
                const user = await AuthService.getUserByID(id);
                return done(null, user);
            } catch {
                return done(null, false);
            }
        });

        this.passportStrategies.forEach((strategy) => {
            passport.use(strategy);
        });
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

    private initErrorHandler() {
        this.app.use(
            (err: unknown, req: Request, res: Response, next: NextFunction) => {
                if (err instanceof HttpException) {
                    res.status(err.code).send({
                        code: err.code,
                        error: err.error
                    });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                        code: StatusCodes.INTERNAL_SERVER_ERROR,
                        error: NODE_ENV === 'development' ? err : undefined
                    });

                    logger.error(err);
                }

                next();
            }
        );
    }

    private initSocketIO() {
        this.io.use(this.websocketMiddleware);

        this.io.on('connection', (socket) =>
            this.onWebsocketConnection(this.io, socket)
        );
    }

    public async initialize() {
        this.app.enable('trust proxy');

        await this.initDatabase();
        this.initCORS();
        this.initSession();
        this.initRateLimiter();
        this.initPassport();
        this.initMiddlewares();
        this.initControllers();
        this.initErrorHandler();
        this.initSocketIO();

        this.http.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`);
        });
    }
}
