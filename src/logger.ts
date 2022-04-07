import winston, { createLogger, format, transports } from 'winston';

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

const colorize = NODE_ENV === 'development' ? [format.colorize()] : [];

const console_format = format.combine(...colorize, format.simple());

const json_format = format.combine(format.timestamp(), format.json());

const logger = createLogger({
    level: LOGGING_LEVEL,
    levels: LoggingLevels,
    format: format.errors({ stack: true }),
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
