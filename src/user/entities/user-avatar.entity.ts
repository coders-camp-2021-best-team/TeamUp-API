import { BaseEntity, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Asset } from '../../assets';
import { User } from '.';

@Entity('user_avatars')
export class UserAvatar extends BaseEntity {
    @OneToOne(() => User, (u) => u.avatar, { primary: true })
    @JoinColumn()
    user: User;

    @OneToOne(() => Asset)
    @JoinColumn()
    asset: Asset;
}
