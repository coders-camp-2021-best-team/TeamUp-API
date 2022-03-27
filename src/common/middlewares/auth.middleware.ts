import { Middleware } from '..';
import { UnauthorizedException } from '../exceptions';

export const AuthMiddleware: Middleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    throw new UnauthorizedException();
};
