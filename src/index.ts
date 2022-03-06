import { getConnectionOptions, createConnection } from 'typeorm';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';

import logger from './logger';

import { API, funnyHeaderMiddleware } from './common';
import { ReportController } from './report';
import { AuthController } from './auth';
import { UserController } from './user';

const server = new API({
    middlewares: [funnyHeaderMiddleware],
    controllers: [
        new UserController(),
        new AuthController(),
        new ReportController()
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
