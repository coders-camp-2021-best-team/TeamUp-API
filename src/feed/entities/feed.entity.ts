import {
    BaseEntity,
    Entity,
    OneToMany,
    CreateDateColumn,
    ManyToOne
} from 'typeorm';
import { User } from '../../user';
import { FeedUser } from '.';
import { Exclude } from 'class-transformer';

@Entity('feeds')
export class Feed extends BaseEntity {
    @Exclude()
    @ManyToOne(() => User, { eager: true, primary: true, onDelete: 'CASCADE' })
    user: User;

    @Exclude()
    @OneToMany(() => FeedUser, (fu) => fu.feed, {
        cascade: true,
        eager: true
    })
    recommendedUsers: FeedUser[];

    recommendedUser?: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdOn: Date;
}
