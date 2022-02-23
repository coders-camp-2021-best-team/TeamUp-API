import express from 'express';
import { getConnectionOptions, createConnection } from 'typeorm';
import { WinstonAdaptor } from 'typeorm-logger-adaptor/logger/winston';

import logger from './logger';
import env from './config';
const { PORT } = env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        message: 'Hello, world!'
    });
});

getConnectionOptions().then((connectionOptions) => {
    return createConnection({
        ...connectionOptions,
        logger: new WinstonAdaptor(logger, 'all')
    });
});

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});
