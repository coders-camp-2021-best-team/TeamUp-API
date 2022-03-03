import { Middleware } from '.';

export const adminAuthMiddleware: Middleware = (req, res, next) => {
    if (req.query.admin === 'true') {
        next();
    } else {
        res.send('Access denied');
    }
};
