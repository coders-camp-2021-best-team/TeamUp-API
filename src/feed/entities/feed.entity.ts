import {
    BaseEntity,
    Entity,
    OneToMany,
    UpdateDateColumn,
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

    @OneToMany(() => FeedUser, (fu) => fu.feed, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE'
    })
    recommendedUsers: FeedUser[];

    @UpdateDateColumn({ type: 'timestamp' })
    createdOn: Date;
}
