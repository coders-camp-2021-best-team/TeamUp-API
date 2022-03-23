import { SwipeType } from '../swipe';
import { User, UserSkill } from '../user';
import { Feed, FeedUser } from './entities';

export const FeedService = new (class {
    async getFeed(userID: string) {
        const feed = await Feed.findOne(userID);

        if (feed) {
            const interval_ms = new Date().getTime() - feed.createdOn.getTime();
            const compare_ms = 8 * 60 * 60 * 1000;

            // if feed is older than 8 hours, generate another one
            if (interval_ms < compare_ms) {
                feed.recommendedUsers = feed.recommendedUsers.filter(
                    (fu) => fu.swiped === false
                );

                return feed;
            }

            await feed.remove();
        }

        const new_feed = await this.createFeed(userID);
        if (!new_feed) return null;
        if (!new_feed.recommendedUsers.length) return null;

        return new_feed.save();
    }

    async createFeed(userID: string) {
        const user = await User.findOne(userID, {
            relations: [
                'skills',
                'skills.level',
                'skills.level.game',
                'blockedUsers',
                'blockedBy',
                'blockedBy.blockedBy',
                'swipedUsers',
                'swipedBy',
                'swipedBy.submittedBy',
                'chatroomsByMe',
                'chatroomsWithMe'
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
            .filter((s) => s.status == SwipeType.DISLIKE)
            .map((s) => s.submittedBy.id);
        const people_that_i_disliked = user.swipedUsers
            .filter((s) => s.status == SwipeType.DISLIKE)
            .map((s) => s.target.id);
        const games_that_i_like = user.skills.map((s) => s.level.game.id);
        const people_i_started_chat_with = user.chatroomsByMe.map(
            (c) => c.recipient2.id
        );
        const people_started_chat_with_me = user.chatroomsWithMe.map(
            (c) => c.recipient1.id
        );

        const similar_users_obj: { [key: string]: FeedUser } = {};

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

                if (people_that_blocked_me.includes(uid)) continue;
                if (people_that_i_blocked.includes(uid)) continue;
                if (people_that_disliked_me.includes(uid)) continue;
                if (people_that_i_disliked.includes(uid)) continue;
                if (people_i_started_chat_with.includes(uid)) continue;
                if (people_started_chat_with_me.includes(uid)) continue;

                if (uid === user.id) continue;

                if (!similar_users_obj[uid]) {
                    const u = await User.findOne(uid);
                    if (!u) continue;

                    const fu = new FeedUser();
                    fu.user = u;
                    fu.common_skills = 0;
                    similar_users_obj[uid] = fu;
                }
                similar_users_obj[uid].common_skills++;
            }
        }

        const similar_users = Object.values(similar_users_obj);

        similar_users.sort((a, b) => b.common_skills - a.common_skills);

        // limit array to max 15 users
        similar_users.length = Math.min(similar_users.length, 15);

        const feed = new Feed();
        feed.user = user;
        feed.recommendedUsers = similar_users;
        return feed;
    }
})();
