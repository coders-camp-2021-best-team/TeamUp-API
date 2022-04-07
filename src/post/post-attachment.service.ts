import { BadRequestException, NotFoundException } from '../common';
import { S3Service } from '../s3';
import { User } from '../user';
import { Post, PostAttachment } from '.';

export const PostAttachmentService = new (class {
    async getPost(postID: string, author?: User) {
        const post = await Post.findOne(postID, {
            where: author ? { author } : undefined,
            relations: ['attachments']
        });
        if (!post) throw new NotFoundException();

        return post;
    }

    async getAttachments(postID: string) {
        const post = await this.getPost(postID);
        return post.attachments;
    }

    async createAttachment(
        user: User,
        postID: string,
        file: Express.MulterS3.File
    ) {
        const post = await this.getPost(postID, user);

        const att = new PostAttachment();
        att.key = file.key;
        post.attachments.push(att);

        if (post.attachments.length > 10) {
            throw new BadRequestException(
                'Post cannot have more than 10 attachments'
            );
        }

        post.updatedOn = new Date();

        await post.save();

        return att;
    }

    async removeAttachment(user: User, postID: string, key: string) {
        const post = await this.getPost(
            postID,
            !user.isAdmin() ? user : undefined
        );

        const att = post.attachments.find((a) => a.key === key);
        if (!att) throw new NotFoundException();

        await S3Service.deleteFile(att.key);
        return att.remove();
    }
})();
