import { Game } from '../game';
import { Like } from 'typeorm';
export const SearchService = new (class {
    async getResults(search: string, take = 5, skip = 1) {
        if (!search) {
            const results = await Game.find({
                take: take,
                skip: (skip - 1) * take
            });

            return results;
        }

        const results = await Game.find({
            where: {
                name: Like(`%${search}%`)
            },
            take: take,
            skip: (skip - 1) * take
        });

        if (!results.length) {
            return null;
        }
        return results;
    }
})();
