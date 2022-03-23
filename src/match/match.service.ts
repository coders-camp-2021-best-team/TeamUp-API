import { ChatService } from '../chat';
import { SwipeService, SwipeType } from '../swipe';
import { User } from '../user';

export const MatchService = new (class {
    async getMatch(userID: string) {
        const feed = await SwipeService.getFeed(userID);

        if (!feed) return null;

        if (
            feed.recommendedUsers.every((fu) => fu.swiped === true) &&
            feed.recommendedUsers.length
        ) {
            feed.recommendedUsers.sort(
                (a, b) => b.common_skills - a.common_skills
            );

            const user = await User.findOne(feed.user.id, {
                relations: ['swipedUsers']
            });
            if (!user) return null;

            for (const targetUser of feed.recommendedUsers) {
                const swipe = user.swipedUsers.find(
                    (s) => s.target.id === targetUser.user.id
                );

                if (swipe?.status === SwipeType.DISLIKE) continue;

                await ChatService.createChatRoom(userID, targetUser.user.id);

                await feed.remove();

                return targetUser.user;
            }

            await feed.remove();
            return { error: 'No matches' };
        }

        return null;
    }
})();
