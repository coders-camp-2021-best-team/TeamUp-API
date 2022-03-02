import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Asset } from '../assets/asset.entity';
import { User } from './user.entity';

@Entity('user_photos')
export class UserPhoto {
    @ManyToOne(() => User, (u) => u.photos)
    user: User;

    @OneToOne(() => Asset, { primary: true })
    @JoinColumn()
    asset: Asset;
}
