import { Game } from '../game';
import { Like } from 'typeorm';

export const SearchService = new (class {
    async getResults(search?: string) {
        if (!search) {
            const results = await Game.find();

            if (!results.length) {
                return null;
            }
            return results;
        }
        const regexSearch = new RegExp(escapeRegex(search), 'gi');

        const results = await Game.find({
            name: Like(`%${regexSearch}%`)
        });

        if (!results.length) {
            return null;
        }
        return results;
    }
})();

export function escapeRegex(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
