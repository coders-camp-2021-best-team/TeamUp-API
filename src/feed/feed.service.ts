import { User, UserSkill } from '../user';

const shuffleArray = <T>(array: T[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export const FeedService = new (class {
    async getRecommended(userID?: string) {
        const user = await User.findOne(userID, {
            relations: ['skills', 'skills.game', 'skills.game.skilled_users']
        });

        if (!user) {
            return null;
        }

        let similar_users: UserSkill[] = [];

        for (const skill of user.skills) {
            similar_users.push(...skill.game.skilled_users);
        }

        similar_users = similar_users.filter((u) => u.user.id !== userID);

        shuffleArray(similar_users);

        // limit array to max 100 users
        similar_users.length = Math.min(similar_users.length, 50);

        return similar_users;
    }
})();
