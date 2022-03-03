import { Middleware } from '.';

export const loggedInUserMiddleware: Middleware = (req, res, next) => {
    if (req.query.loggedIn === 'true') {
        next();
    } else {
        res.send('Log in to see this page');
    }
};
