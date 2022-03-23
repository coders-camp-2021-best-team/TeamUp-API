import { UserSwipe, SwipeType } from '.';
import { Feed } from '../feed';
import { User } from '../user';

export const SwipeService = new (class {
    getFeed(userID: string) {
        return Feed.findOne(userID);
    }

    async getSwipes(userID: string) {
        return (
            await User.findOne(userID, {
                relations: ['swipedUsers']
            })
        )?.swipedUsers;
    }

    async createSwipe(userID: string, targetID: string, status: SwipeType) {
        const feed = await this.getFeed(userID);

        if (!feed) return null;

        const target_feeduser = feed.recommendedUsers.find(
            (r) => r.user.id === targetID
        );
        if (!target_feeduser) return null;

        target_feeduser.swiped = true;
        target_feeduser.save();

        const swipe = new UserSwipe();
        swipe.submittedBy = feed.user;
        swipe.target = target_feeduser.user;
        swipe.status = status;
        return swipe.save();
    }
})();
