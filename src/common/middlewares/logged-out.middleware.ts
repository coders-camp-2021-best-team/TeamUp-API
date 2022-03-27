import { StatusCodes } from 'http-status-codes';

import { Middleware } from '..';

export const LoggedOutMiddleware: Middleware = (req, res, next) => {
    if (req.isUnauthenticated()) {
        return next();
    }
    return res.status(StatusCodes.FORBIDDEN).send();
};
