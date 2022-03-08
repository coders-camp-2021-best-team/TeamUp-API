import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Asset } from '../../assets';
import { User } from '.';

@Entity('user_photos')
export class UserPhoto extends BaseEntity {
    @ManyToOne(() => User, (u) => u.photos)
    user: User;

    @OneToOne(() => Asset, { primary: true })
    @JoinColumn()
    asset: Asset;
}
