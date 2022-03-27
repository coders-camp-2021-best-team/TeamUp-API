import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ValidationException } from '.';

// eslint-disable-next-line @typescript-eslint/ban-types
export const validate = <T extends Object>(
    type: ClassConstructor<T>,
    plain: unknown
) => {
    const data = plainToInstance(type, plain);
    if (typeof data !== 'object') {
        throw new ValidationException();
    }

    const errors = validateSync(data);
    if (errors.length) {
        throw new ValidationException(errors);
    }

    return data;
};
