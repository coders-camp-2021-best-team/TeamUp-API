import { NextFunction, Request, Response } from 'express';

export const funnyHeaderMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.header('X-Funny-Header', 'example!');
    next();
};
