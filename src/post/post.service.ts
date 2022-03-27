import { FindConditions, ILike } from 'typeorm';

import { NotFoundException } from '../common';
import { User } from '../user';
import {
    CreatePostDto,
    Post,
    PostCategory,
    QueryPostDto,
    UpdatePostDto
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

    async createPost(user: User, data: CreatePostDto) {
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

    async getPost(postID: string, author?: User) {
        const post = await Post.findOne(postID, {
            where: author ? { author } : undefined
        });
        if (!post) throw new NotFoundException();

        return post;
    }

    async updatePost(user: User, postID: string, body: UpdatePostDto) {
        const post = await this.getPost(postID, user);

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

    async removePost(user: User, postID: string) {
        const post = await this.getPost(
            postID,
            !user.isAdmin() ? user : undefined
        );

        return post.remove();
    }
})();
