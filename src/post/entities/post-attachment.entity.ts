import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Post } from './post.entity';

@Entity('post_attachments')
export class PostAttachment extends BaseEntity {
    @PrimaryColumn()
    key: string;

    @ManyToOne(() => Post, (p) => p.attachments, {
        onDelete: 'CASCADE'
    })
    post: Post;
}
