import { StatusCodes } from 'http-status-codes';

import { HttpException } from '.';

export class BadRequestException extends HttpException {
    constructor(error?: object | string) {
        super(StatusCodes.BAD_REQUEST, error);
    }
}
