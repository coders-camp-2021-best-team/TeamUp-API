import { getConnectionOptions, createConnection } from 'typeorm';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';

import logger from './logger';

import { API, funnyHeaderMiddleware } from './common';
import { HelloWorldController } from './hello-world';
import { MemeService } from './memes/meme.service';
import { MemeController } from './memes/meme.controller';

const server = new API({
    middlewares: [funnyHeaderMiddleware],
    controllers: [new HelloWorldController(), new MemeController()]
});

getConnectionOptions()
    .then((connectionOptions) => {
        return createConnection({
            ...connectionOptions,
            logger: new WinstonAdaptor(logger, 'all')
        });
    })
    .then(() => server.initialize());
