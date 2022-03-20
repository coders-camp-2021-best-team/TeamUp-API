import { Like } from 'typeorm';
import { Game } from '../game';
export const SearchService = new (class {
    async getResults(search: string, take = 20, skip = 0) {
        if (!search) {
            const results = await Game.find({
                take: take,
                skip: skip
            });

            return results;
        }

        const results = await Game.find({
            where: {
                name: Like(`%${search}%`)
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
