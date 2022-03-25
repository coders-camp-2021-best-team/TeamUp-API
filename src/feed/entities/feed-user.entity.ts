import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { User } from '../../user';
import { Feed } from './feed.entity';

@Entity('feed_users')
export class FeedUser extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Feed, (f) => f.recommendedUsers, {
        onDelete: 'CASCADE'
    })
    feed: Feed;

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    user: User;

    @Column('int')
    common_skills: number;

    @Column('bool', { default: false })
    swiped: boolean;
}
