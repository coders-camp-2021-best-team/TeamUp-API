import { FindConditions, ILike } from 'typeorm';

import {
    CreateCategoryDto,
    PostCategory,
    QueryPostDto,
    UpdateCategoryDto
} from '.';

export const PostCategoryService = new (class {
    async getCategories({ q, skip, take, sort }: QueryPostDto) {
        const cond = ILike(`%${q}%`);
        const where: FindConditions<PostCategory> | undefined = q
            ? { name: cond }
            : undefined;

        return PostCategory.find({
            where,
            skip,
            take,
            order: { name: sort }
        });
    }

    async createCategory(data: CreateCategoryDto) {
        const cat = new PostCategory();
        cat.name = data.name;
        return cat.save();
    }

    async updateCategory(catID: string, body: UpdateCategoryDto) {
        const cat = await PostCategory.findOne(catID);

        if (!cat) return null;

        cat.name = body.name || cat.name;

        return cat.save();
    }

    async removeCategory(catID: string) {
        const post = await PostCategory.findOne(catID);

        if (!post) return null;

        return post.remove();
    }
})();
