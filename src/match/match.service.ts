import { ChatService } from '../chat';
import { SwipeService } from '../swipe';

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

            const match = feed.recommendedUsers[0];

            await ChatService.createChatRoom(userID, match.user.id);

            await feed.remove();

            return match;
        }

        return null;
    }
})();
