import { User } from '../user';
import { Post, PostVoteType, CreateVoteDto, PostVote } from '.';

export const PostVoteService = new (class {
    async getVotes(userID: string, postID: string) {
        const post = await Post.findOne(postID, {
            relations: ['votes']
        });

        if (!post) return null;

        return {
            upvotes: post.votes.reduce(
                (sum, v) => (v.type === PostVoteType.UPVOTE ? sum + 1 : sum),
                0
            ),
            downvotes: post.votes.reduce(
                (sum, v) => (v.type === PostVoteType.DOWNVOTE ? sum + 1 : sum),
                0
            ),
            me: post.votes.find((v) => v.user.id === userID) || null
        };
    }

    async createVote(userID: string, postID: string, data: CreateVoteDto) {
        const post = await Post.findOne(postID, {
            relations: ['votes']
        });
        const user = await User.findOne(userID);

        if (!post || !user) return null;

        const vote = post.votes.find((v) => v.user.id === userID);
        if (!vote) {
            const vote = new PostVote();
            vote.user = user;
            vote.type = data.type;

            post.votes.push(vote);
        } else {
            vote.type = data.type;
        }

        return post.save();
    }

    async removeVote(userID: string, postID: string) {
        const vote = await PostVote.findOne({
            where: {
                user: { id: userID },
                post: { id: postID }
            },
            relations: ['post']
        });

        if (!vote) return null;

        return vote.remove();
    }
})();
