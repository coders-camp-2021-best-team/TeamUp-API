import { UserService } from '../user';
import { UserSwipe, UserSwipeType } from '.';

export const SwipeService = new (class {
    async createSwipe(
        swipedByID: string,
        targetID: string,
        status: UserSwipeType
    ) {
        const swipe = new UserSwipe();

        const submittedByUser = await UserService.getUser(swipedByID);
        const targetUser = await UserService.getUser(targetID);

        if (!targetUser || !submittedByUser) {
            return null;
        }

        swipe.target = targetUser;
        swipe.submittedBy = targetUser;
        swipe.status = status;

        return swipe.save();
    }
})();
