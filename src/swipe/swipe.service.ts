import { ForbiddenException, NotFoundException } from '../common';
import { Feed } from '../feed';
import { User } from '../user';
import { SwipeType, UserSwipe } from '.';

export const SwipeService = new (class {
    async getFeed(user: User) {
        const feed = await Feed.findOne(user.id);
        if (!feed) throw new NotFoundException();

        return feed;
    }

    async getSwipes({ id }: User) {
        const user = await User.findOne(id, {
            relations: ['swipedUsers']
        });
        if (!user) throw new NotFoundException();

        return user.swipedUsers;
    }

    async createSwipe(user: User, targetID: string, status: SwipeType) {
        const feed = await this.getFeed(user);

        const target_feeduser = feed.recommendedUsers.filter(
            (fu) => !fu.swiped
        )[0];
        if (!target_feeduser || target_feeduser.user.id !== targetID) {
            throw new ForbiddenException(
                'You cannot swipe user that is not in your feed'
            );
        }

        target_feeduser.swiped = true;
        target_feeduser.save();

        const swipe = new UserSwipe();
        swipe.submittedBy = feed.user;
        swipe.target = target_feeduser.user;
        swipe.status = status;
        return swipe.save();
    }

    async removeSwipe(user: User, swipeID: string) {
        const swipe = await UserSwipe.findOne(swipeID, {
            where: { submittedBy: user },
            relations: ['submittedBy']
        });
        if (!swipe) throw new NotFoundException();

        return swipe.remove();
    }
})();
