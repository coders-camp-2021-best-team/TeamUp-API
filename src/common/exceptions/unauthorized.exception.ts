import { StatusCodes } from 'http-status-codes';

import { HttpException } from '.';

export class UnauthorizedException extends HttpException {
    constructor(error?: object | string) {
        super(StatusCodes.UNAUTHORIZED, error);
    }
}
