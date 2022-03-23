import { ILike } from 'typeorm';
import { User } from '../user';
export const SearchService = new (class {
    async getResults(search: string, take = 20, skip = 0) {
        const results = await User.find({
            where: [
                {
                    first_name: ILike(`%${search}%`)
                },
                {
                    last_name: ILike(`%${search}%`)
                },
                {
                    username: ILike(`%${search}%`)
                }
            ],
            take,
            skip
        });

        return results;
    }
})();
