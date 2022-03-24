import { FindConditions, ILike } from 'typeorm';
import { User, UserRank } from '../user';
import {
    QueryPostDto,
    Post,
    CreatePostDto,
    UpdatePostDto,
    PostCategory
} from '.';

export const PostService = new (class {
    async getPosts({ q, skip, take, sort }: QueryPostDto) {
        const cond = ILike(`%${q}%`);
        const where: FindConditions<Post>[] | undefined = q
            ? [{ title: cond }, { body: cond }]
            : undefined;

        return Post.find({
            where,
            skip,
            take,
            order: { updatedOn: sort }
        });
    }

    async createPost(userID: string, data: CreatePostDto) {
        const user = await User.findOne(userID);

        if (!user) return null;

        const categories = await PostCategory.find<PostCategory>({
            where: data.categories.map((id) => ({ id }))
        });

        const post = new Post();
        post.author = user;
        post.categories = categories;
        post.title = data.title;
        post.body = data.body;
        return post.save();
    }

    async updatePost(userID: string, postID: string, body: UpdatePostDto) {
        const post = await Post.findOne(postID, {
            where: {
                author: { id: userID }
            }
        });

        if (!post) return null;

        post.title = body.title || post.title;
        post.body = body.body || post.body;

        post.categories = body.categories
            ? await PostCategory.find<PostCategory>({
                  where: body.categories.map((id) => ({ id }))
              })
            : post.categories;

        post.updatedOn = new Date();

        return post.save();
    }

    async removePost(userID: string, postID: string) {
        const user = await User.findOne(userID);

        if (!user) return null;

        const where =
            user.rank !== UserRank.ADMIN
                ? { author: { id: userID } }
                : undefined;

        const post = await Post.findOne(postID, {
            where
        });

        if (!post) return null;

        return post.remove();
    }
})();
