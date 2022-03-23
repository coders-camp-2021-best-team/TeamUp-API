import { createServer } from 'http';
import express from 'express';
import 'express-async-errors';
import session from 'express-session';
import RateLimiter from 'express-rate-limit';
import SlowDown from 'express-slow-down';
import cors from 'cors';
import ConnectRedis from 'connect-redis';
import Redis from 'ioredis';
import { Socket, Server } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { getConnectionOptions, createConnection } from 'typeorm';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';
import { Middleware, Controller } from '../common';

import logger from '../logger';
import env from '../config';
const { PORT, SESSION_SECRET, REDIS_URL, REDIS_TLS_URL, CLIENT_URL } = env;

const RedisStore = ConnectRedis(session);

declare module 'express-session' {
    interface SessionData {
        loggedIn: boolean;
        userID: string;
    }
}

export type WebsocketConnectionHandler = (io: Server, socket: Socket) => void;

export type WebsocketMiddleware = (
    socket: Socket,
    next: (err?: ExtendedError) => void
) => void;

export class API {
    private app = express();
    private http = createServer(this.app);
    private io = new Server(this.http);

    private session_middleware: express.RequestHandler;
    private middlewares: Middleware[];
    private controllers: Controller[];
    private onWebsocketConnection: WebsocketConnectionHandler;
    private websocketMiddleware: WebsocketMiddleware;

    constructor(options: {
        middlewares: Middleware[];
        controllers: Controller[];
        onWebsocketConnection: WebsocketConnectionHandler;
        websocketMiddleware: WebsocketMiddleware;
    }) {
        this.middlewares = options.middlewares;
        this.controllers = options.controllers;
        this.onWebsocketConnection = options.onWebsocketConnection;
        this.websocketMiddleware = options.websocketMiddleware;
    }

    private initCORS() {
        this.app.use(
            cors({
                origin: CLIENT_URL
            })
        );
    }

    private async initDatabase() {
        const options = await getConnectionOptions();

        await createConnection({
            logger: new WinstonAdaptor(logger, 'all'),
            ...options
        });
    }

    private initSession() {
        const redis_client = new Redis(REDIS_TLS_URL || REDIS_URL);

        this.session_middleware = session({
            store: new RedisStore({
                client: redis_client
            }),
            saveUninitialized: false,
            secret: SESSION_SECRET,
            resave: false,
            cookie: {
                httpOnly: true
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
        this.initMiddlewares();
        this.initControllers();
        this.initSocketIO();

        this.http.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`);
        });
    }
}
