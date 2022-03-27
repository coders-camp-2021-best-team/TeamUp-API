import { StatusCodes } from 'http-status-codes';

import { HttpException } from '.';

export class ConflictException extends HttpException {
    constructor(error?: object | string) {
        super(StatusCodes.CONFLICT, error);
    }
}
