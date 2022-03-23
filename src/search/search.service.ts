import { FindConditions, ILike } from 'typeorm';
import { User } from '../user';
import { SearchQueryDto } from '.';
export const SearchService = new (class {
    async getResults({ q, skip, take }: SearchQueryDto) {
        const cond = ILike(`%${q}%`);
        const where: FindConditions<User>[] | undefined = q
            ? [{ first_name: cond }, { last_name: cond }, { username: cond }]
            : undefined;

        return User.find({
            where,
            skip,
            take
        });
    }
})();
