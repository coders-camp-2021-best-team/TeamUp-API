import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Post } from './post.entity';

@Entity('post_categories')
export class PostCategory extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Post, (p) => p.categories, { onDelete: 'CASCADE' })
    posts: Post[];
}
