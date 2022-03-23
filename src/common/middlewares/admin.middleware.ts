import { StatusCodes } from 'http-status-codes';
import { UserService, UserRank } from '../../user';
import { Middleware } from '.';

export const AdminMiddleware: Middleware = (req, res, next) => {
    if (req.session.loggedIn) {
        const { userID } = req.session;

        UserService.getUser(userID || '')
            .then((user) => {
                if (!user || user.rank !== UserRank.ADMIN) {
                    return res.status(StatusCodes.UNAUTHORIZED).send();
                }
                next();
            })
            .catch(() => {
                res.status(StatusCodes.UNAUTHORIZED).send();
            });
    }
};
