import { StatusCodes } from 'http-status-codes';

import { Middleware } from '.';

export const AuthMiddleware: Middleware = (req, res, next) => {
    if (req.session.loggedIn) return next();

    return res.status(StatusCodes.UNAUTHORIZED).send();
};
