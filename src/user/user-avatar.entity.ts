import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { User } from './user.entity';

@Entity('user_avatars')
export class UserAvatar {
    @OneToOne(() => User, (u) => u.avatar, { primary: true })
    @JoinColumn()
    user: User;

    @OneToOne(() => Asset)
    @JoinColumn()
    asset: Asset;
}
