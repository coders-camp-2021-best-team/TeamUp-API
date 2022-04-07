import { StatusCodes } from 'http-status-codes';

import { HttpException } from '.';

export class ForbiddenException extends HttpException {
    constructor(error?: object | string) {
        super(StatusCodes.FORBIDDEN, error);
    }
}
