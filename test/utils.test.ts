import { add } from '../src/utils';

describe('add()', () => {
    it('should add numbers', () => {
        expect(add(4, 9)).toEqual(13);
    });
});
