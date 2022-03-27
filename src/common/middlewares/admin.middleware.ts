import { Middleware } from '..';
import { ForbiddenException, UnauthorizedException } from '../exceptions';

export const AdminMiddleware: Middleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin()) {
            return next();
        }
        throw new ForbiddenException();
    }
    throw new UnauthorizedException();
};
