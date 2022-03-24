import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { User } from '../../user';
import { PostVote } from '.';
import { PostCategory } from './post-category.entity';
import { PostAttachment } from './post-attachment.entity';

@Entity('posts')
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', eager: true })
    author: User;

    @ManyToMany(() => PostCategory, (c) => c.posts, {
        eager: true,
        cascade: true
    })
    @JoinTable({ name: 'posts_categories' })
    categories: PostCategory[];

    @Column()
    title: string;

    @Column('text')
    body: string;

    @OneToMany(() => PostAttachment, (a) => a.post, {
        cascade: true
    })
    attachments: PostAttachment[];

    @OneToMany(() => PostVote, (v) => v.post, { cascade: true })
    votes: PostVote[];

    @CreateDateColumn({ type: 'timestamp' })
    createdOn: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedOn: Date;
}
