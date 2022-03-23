import { UserService } from '../user';
import { UserSwipe, SwipeType } from '.';

export const SwipeService = new (class {
    async createSwipe(swipedByID: string, targetID: string, status: SwipeType) {
        const swipe = new UserSwipe();

        const submittedByUser = await UserService.getUser(swipedByID);
        const targetUser = await UserService.getUser(targetID);

        if (!targetUser || !submittedByUser) {
            return null;
        }

        swipe.target = targetUser;
        swipe.submittedBy = submittedByUser;
        swipe.status = status;

        return swipe.save();
    }

    async swipeMatch(swipe: UserSwipe | null) {
        if (!swipe || swipe.status === SwipeType.DISLIKE) {
            return;
        }
        const matchingSwipe = await UserSwipe.findOne({
            where: {
                target: swipe.submittedBy,
                submittedBy: swipe.target,
                status: SwipeType.LIKE
            }
        });
        if (!matchingSwipe) {
            return;
        }
        // PLACEHOLDER FOR CHAT MATCHING
        return { msg: 'Match created' }; // adjust to front-end req
    }
})();
