import { UserSwipe } from './entities';
import { UserService } from '../user';
import { SwipeUserDto } from './dto/create-swipe.dto';

export const SwipeService = new (class {
    async changeUser(data: SwipeUserDto) {
        const swipe = new UserSwipe();

        const targetUser = await UserService.getUser(data.target);
        const submittedByUser = await UserService.getUser(data.submittedBy);

        if (!targetUser || !submittedByUser) {
            return null;
        }

        swipe.target = targetUser;
        swipe.submittedBy = targetUser;
        swipe.status = data.status;

        return swipe.save();
    }
})();
