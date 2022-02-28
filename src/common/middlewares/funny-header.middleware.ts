import { Middleware } from '.';

export const funnyHeaderMiddleware: Middleware = (req, res, next) => {
    res.header('X-Funny-Header', 'example!');
    next();
};
