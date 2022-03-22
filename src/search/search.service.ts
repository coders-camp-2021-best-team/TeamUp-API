import { Like } from 'typeorm';
import { UserSkill } from '../user';
export const SearchService = new (class {
    async getResults(search: string, take = 20, skip = 0) {
        const results = await UserSkill.find({
            where: {
                game: {
                    name: Like(`%${search}%`)
                }
            },
            take: take,
            skip: skip
        });

        if (!results.length) {
            return null;
        }
        return results;
    }
})();
