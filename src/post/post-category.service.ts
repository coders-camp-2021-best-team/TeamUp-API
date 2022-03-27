import { FindConditions, ILike } from 'typeorm';

import { NotFoundException } from '../common';
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

    async getCategory(categoryID: string) {
        const cat = await PostCategory.findOne(categoryID);
        if (!cat) throw new NotFoundException();

        return cat;
    }

    async updateCategory(catID: string, body: UpdateCategoryDto) {
        const cat = await this.getCategory(catID);

        cat.name = body.name || cat.name;

        return cat.save();
    }

    async removeCategory(catID: string) {
        const cat = await this.getCategory(catID);
        return cat.remove();
    }
})();
