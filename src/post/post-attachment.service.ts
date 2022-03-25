import { S3Service } from '../s3';
import { User } from '../user';
import { Post, PostAttachment } from '.';

export const PostAttachmentService = new (class {
    async getAttachments(postID: string) {
        const post = await Post.findOne(postID, {
            relations: ['attachments']
        });
        if (!post) return null;

        return post.attachments;
    }

    async createAttachment(
        userID: string,
        postID: string,
        file: Express.MulterS3.File
    ) {
        const post = await Post.findOne(postID, {
            where: {
                author: { id: userID }
            },
            relations: ['attachments']
        });
        if (!post) return null;

        const att = new PostAttachment();
        att.key = file.key;
        post.attachments.push(att);

        if (post.attachments.length > 10) return null;

        post.updatedOn = new Date();

        await post.save();

        return att;
    }

    async removeAttachment(userID: string, postID: string, key: string) {
        const user = await User.findOne(userID);
        if (!user) return null;

        const post = await Post.findOne(postID, {
            relations: ['attachments']
        });
        if (!post) return null;

        const att = post.attachments.find((a) => a.key === key);
        if (!att) return null;

        await S3Service.deleteFile(att.key);
        return att.remove();
    }
})();
