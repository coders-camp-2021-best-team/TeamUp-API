import { getReasonPhrase } from 'http-status-codes';

export class HttpException extends Error {
    constructor(public code: number, public error?: object | string) {
        super(getReasonPhrase(code));
    }
}
