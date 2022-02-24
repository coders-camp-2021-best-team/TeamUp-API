import express from 'express';
import { getConnectionOptions, createConnection } from 'typeorm';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';

import { funnyHeaderMiddleware } from './common/middlewares';
import { HelloWorldRouter } from './hello-world';

import logger from './logger';
import env from './config';
const { PORT } = env;

const server = () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(funnyHeaderMiddleware);

    app.use('/hello-world', HelloWorldRouter);

    app.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
    });
};

getConnectionOptions()
    .then((connectionOptions) => {
        return createConnection({
            ...connectionOptions,
            logger: new WinstonAdaptor(logger, 'all')
        });
    })
    .then(server);
