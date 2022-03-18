import { Game } from '../game';
import { Like } from 'typeorm';
export const SearchService = new (class {
    async getResults(search: string) {
        if (!search) {
            const results = await Game.find();

            return results;
        }

        const results = await Game.find({
            name: Like(`%${search}%`)
        });

        if (!results.length) {
            return null;
        }
        return results;
    }
})();
