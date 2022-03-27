import { BadRequestException, NotFoundException } from '../common';
import { User } from '../user';
import { UserBlock } from './entities';

export const BlockService = new (class {
    getBlockedUsers(user: User) {
        return UserBlock.find({
            where: { blockedBy: user },
            relations: ['blockedBy']
        });
    }

    async blockUser(user: User, targetID: string) {
        if (user.id === targetID) {
            throw new BadRequestException('You cannot block yourself');
        }

        const target = await User.findOne(targetID);
        if (!target) {
            throw new NotFoundException();
        }

        const block = new UserBlock();
        block.blockedBy = user;
        block.target = target;
        return block.save();
    }

    async unblockUser(user: User, blockID: string) {
        try {
            const block = await UserBlock.findOneOrFail(blockID, {
                where: { blockedBy: user }
            });

            return block.remove();
        } catch {
            throw new NotFoundException();
        }
    }
})();
