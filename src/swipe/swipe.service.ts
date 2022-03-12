import { UserSwipe, UserSwipeType } from './entities';
import { UserService } from '../user';

export const SwipeService = new (class {
    async changeUser(
        target: string,
        submittedBy: string,
        status: UserSwipeType
    ) {
        const swipe = new UserSwipe();

        const targetUser = await UserService.getUser(target);
        const submittedByUser = await UserService.getUser(submittedBy);

        if (!targetUser || !submittedByUser) {
            return null;
        }

        swipe.target = targetUser;
        swipe.submittedBy = targetUser;
        swipe.status = status;

        return swipe.save();
    }
})();
