import { ChatService } from '../chat';
import { InternalServerErrorException, NotFoundException } from '../common';
import { Feed } from '../feed';
import { SwipeType } from '../swipe';
import { User } from '../user';

export const MatchService = new (class {
    async getMatch(user: User) {
        const feed = await Feed.findOne(user.id);
        if (!feed) throw new NotFoundException();

        try {
            const everyone_swiped = feed.recommendedUsers.every(
                (u) => u.swiped
            );

            if (everyone_swiped) {
                feed.recommendedUsers.sort(
                    (a, b) => b.common_skills - a.common_skills
                );

                const { swipedUsers } = await User.findOneOrFail(feed.user.id, {
                    relations: ['swipedUsers']
                });

                for (const { user: targetUser } of feed.recommendedUsers) {
                    const swipe = swipedUsers.find(
                        (s) => s.target.id === targetUser.id
                    );

                    if (swipe?.status === SwipeType.DISLIKE) continue;

                    await ChatService.createChatRoom(user, targetUser);

                    await feed.remove();

                    return targetUser;
                }

                await feed.remove();
            }
        } catch {
            throw new InternalServerErrorException();
        }

        throw new NotFoundException();
    }
})();
