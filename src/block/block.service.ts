import { User } from '../user';
import { UserBlock } from './entities';

export const BlockService = new (class {
    getUser(userID: string) {
        return User.findOne(userID, {
            relations: ['blockedUsers']
        });
    }

    async getBlockedUsers(userID: string) {
        const user = await this.getUser(userID);

        if (!user) return null;

        return user.blockedUsers;
    }

    async blockUser(userID: string, targetID: string) {
        if (!userID || !targetID || userID === targetID) return null;

        const user = await this.getUser(userID);
        const target = await this.getUser(targetID);

        if (!user || !target) return null;

        const block = new UserBlock();
        block.target = target;

        if (!user.blockedUsers.some((b) => b.target.id === target.id)) {
            user.blockedUsers.push(block);
        } else {
            return null;
        }

        await user.save();
        return user.blockedUsers;
    }

    async unblockUser(userID: string, blockID: string) {
        const block = await UserBlock.findOne(blockID, {
            where: {
                blockedBy: { id: userID }
            }
        });

        if (!block) return null;

        return block.remove();
    }
})();
