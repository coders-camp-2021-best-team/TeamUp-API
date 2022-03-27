import { StatusCodes } from 'http-status-codes';

import { HttpException } from '.';

export class NotFoundException extends HttpException {
    constructor(error?: object | string) {
        super(StatusCodes.NOT_FOUND, error);
    }
}
