import { ValidationError } from 'class-validator';

import { BadRequestException } from '.';

export class ValidationException extends BadRequestException {
    constructor(error?: ValidationError[]) {
        super(error);
    }
}
