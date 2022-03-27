import { StatusCodes } from 'http-status-codes';

import { UserRank } from '../../user';
import { Middleware } from '..';

export const AdminMiddleware: Middleware = (req, res, next) => {
    if (req.isAuthenticated() && req.user.rank === UserRank.ADMIN) {
        return next();
    }
    return res.status(StatusCodes.UNAUTHORIZED).send();
};
