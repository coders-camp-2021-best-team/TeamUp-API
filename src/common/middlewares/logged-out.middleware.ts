import { Middleware } from '..';
import { ForbiddenException } from '../exceptions';

export const LoggedOutMiddleware: Middleware = (req, res, next) => {
    if (req.isUnauthenticated()) {
        return next();
    }
    throw new ForbiddenException();
};
