import { User } from '../user';
import { Post } from '.';
import { S3Service } from '../s3';
import { Asset } from '../assets';

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
        files: Express.MulterS3.File[]
    ) {
        const post = await Post.findOne(postID, {
            where: {
                author: { id: userID }
            },
            relations: ['attachments']
        });
        if (!post) return null;

        post.attachments.push(
            ...files.map((file) => {
                const a = new Asset();
                a.key = file.key;
                return a;
            })
        );

        if (post.attachments.length > 10) return null;

        post.updatedOn = new Date();

        return post.save();
    }

    async removeAttachment(
        userID: string,
        postID: string,
        attachmentID: string
    ) {
        const user = await User.findOne(userID);
        if (!user) return null;

        const post = await Post.findOne(postID, {
            relations: ['attachments']
        });
        if (!post) return null;

        const att = post.attachments.find((a) => a.id === attachmentID);
        if (!att) return null;

        await S3Service.deleteFile(att.key);
        return att.remove();
    }
})();
