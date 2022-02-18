import express from 'express';

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

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);

    logger.error('test!');
    logger.warn('test!');
    logger.info('test!');
    logger.http('test!');
    logger.debug('test!');
});
