import { getConnectionOptions, createConnection } from 'typeorm';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';

import logger from './logger';

import { API, funnyHeaderMiddleware } from './common';
import { ReportController } from './report';
import { AuthController } from './auth';
import { UserController } from './user';
import { GameController } from './game';

const server = new API({
    middlewares: [funnyHeaderMiddleware],
    controllers: [
        new UserController(),
        new AuthController(),
        new ReportController(),
        new GameController()
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
