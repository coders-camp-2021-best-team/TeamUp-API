import { getRepository } from 'typeorm';
import { Meme } from './meme.entity';

export const MemeService = new (class {
    async getAllMemes() {
        const memeRepo = getRepository(Meme);

        return memeRepo.find();
    }
})();
