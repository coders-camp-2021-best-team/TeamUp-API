import { StatusCodes } from 'http-status-codes';

import { HttpException } from '.';

export class InternalServerErrorException extends HttpException {
    constructor(error?: object | string) {
        super(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
}
