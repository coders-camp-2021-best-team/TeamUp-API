import { createLogger, format, transports } from 'winston';
import winston from 'winston/lib/winston/config';

import env, { LoggingLevels } from './config';
const { NODE_ENV, LOGGING_LEVEL } = env;

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'grey'
};

winston.addColors(colors);

const console_format =
    NODE_ENV === 'development'
        ? format.combine(format.colorize(), format.simple())
        : format.simple();

const json_format = format.combine(format.timestamp(), format.json());

export const logger = createLogger({
    level: LOGGING_LEVEL,
    levels: LoggingLevels,
    transports: [
        new transports.Console({
            format: console_format
        }),
        new transports.File({
            filename: 'logs/combined.log',
            format: json_format
        }),
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: json_format
        })
    ]
});

export default logger;
