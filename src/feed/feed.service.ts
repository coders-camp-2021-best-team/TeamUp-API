import { UserSwipeType } from '../swipe';
import { User, UserSkill } from '../user';

export const FeedService = new (class {
    async getRecommended(userID?: string) {
        const user = await User.findOne(userID, {
            relations: [
                'skills',
                'skills.level',
                'skills.level.game',
                'blockedUsers',
                'blockedBy',
                'swipedUsers',
                'swipedBy'
            ]
        });

        if (!user) {
            return null;
        }

        const people_that_blocked_me = user.blockedBy.map(
            (b) => b.blockedBy.id
        );
        const people_that_i_blocked = user.blockedUsers.map((b) => b.target.id);
        const people_that_disliked_me = user.swipedBy
            .filter((s) => s.status == UserSwipeType.DISLIKE)
            .map((s) => s.submittedBy.id);
        const people_that_i_disliked = user.swipedUsers
            .filter((s) => s.status == UserSwipeType.DISLIKE)
            .map((s) => s.target.id);
        const games_that_i_like = user.skills.map((s) => s.level.game.id);

        const similar_users_obj: { [key: string]: User } = {};

        for (const gameID of games_that_i_like) {
            const skills = await UserSkill.find({
                where: { level: { game: { id: gameID } } },
                relations: ['level', 'level.game'],
                loadRelationIds: {
                    relations: ['user'],
                    disableMixedMap: true
                }
            });

            for (const skill of skills) {
                const uid = skill.user?.id || '';
                delete skill.user;

                if (people_that_blocked_me.includes(uid)) continue;
                if (people_that_i_blocked.includes(uid)) continue;
                if (people_that_disliked_me.includes(uid)) continue;
                if (people_that_i_disliked.includes(uid)) continue;

                if (uid == user.id) continue;

                if (!similar_users_obj[uid]) {
                    const u = await User.findOne(uid);
                    if (!u) continue;

                    similar_users_obj[uid] = u;
                    similar_users_obj[uid].common_skills = [];
                }
                similar_users_obj[uid].common_skills?.push(skill);
            }
        }

        const similar_users = Object.values(similar_users_obj);

        similar_users.sort(
            (a, b) =>
                (b.common_skills?.length || 0) - (a.common_skills?.length || 0)
        );

        // limit array to max 50 users
        similar_users.length = Math.min(similar_users.length, 50);

        return similar_users;
    }
})();
