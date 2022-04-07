import { NotFoundException } from '../common';
import { User } from '../user';
import { CreateVoteDto, Post, PostVote, PostVoteType } from '.';

export const PostVoteService = new (class {
    async getPost(postID: string) {
        const post = await Post.findOne(postID, {
            relations: ['votes']
        });
        if (!post) throw new NotFoundException();

        return post;
    }

    async getVotes(user: User, postID: string) {
        const post = await this.getPost(postID);

        return {
            upvotes: post.votes.reduce(
                (sum, v) => (v.type === PostVoteType.UPVOTE ? sum + 1 : sum),
                0
            ),
            downvotes: post.votes.reduce(
                (sum, v) => (v.type === PostVoteType.DOWNVOTE ? sum + 1 : sum),
                0
            ),
            me: post.votes.find((v) => v.user.id === user.id) || null
        };
    }

    async createVote(user: User, postID: string, data: CreateVoteDto) {
        const post = await this.getPost(postID);

        const vote = post.votes.find((v) => v.user.id === user.id);
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

    async removeVote(user: User, postID: string) {
        const vote = await PostVote.findOne({
            where: {
                user,
                post: { id: postID }
            },
            relations: ['post']
        });
        if (!vote) throw new NotFoundException();

        return vote.remove();
    }
})();
