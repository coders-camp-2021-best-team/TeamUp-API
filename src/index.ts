import { getConnectionOptions, createConnection } from 'typeorm';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';

import logger from './logger';

import { API, funnyHeaderMiddleware, gameMiddleware } from './common';
import { ReportController } from './report';
import { AuthController } from './auth';
import { UserController } from './user';
import { GameController } from './game';
import { FeedController } from './feed/feed.controller';

const server = new API({
    middlewares: [funnyHeaderMiddleware, gameMiddleware],
    controllers: [
        new UserController(),
        new AuthController(),
        new ReportController(),
        new GameController(),
        new FeedController()
    ]
});

getConnectionOptions()
    .then((connectionOptions) => {
        return createConnection({
            ...connectionOptions,
            logger: new WinstonAdaptor(logger, 'all')
        });
    })
    .then(() => server.initialize());
