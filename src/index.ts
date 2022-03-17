import { getConnectionOptions, createConnection } from 'typeorm';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';

import logger from './logger';

import { API, funnyHeaderMiddleware } from './common';
import { ReportController } from './report';
import { AuthController } from './auth';
import { UserController } from './user';
import { SearchController } from './search';
import { FeedController } from './feed/feed.controller';

const server = new API({
    middlewares: [funnyHeaderMiddleware],
    controllers: [
        new UserController(),
        new AuthController(),
        new FeedController(),
        new ReportController(),
        new SearchController()
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
