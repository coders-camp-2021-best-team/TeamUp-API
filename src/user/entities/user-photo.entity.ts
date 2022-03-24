import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '.';

@Entity('user_photos')
export class UserPhoto extends BaseEntity {
    @PrimaryColumn()
    key: string;

    @ManyToOne(() => User, (u) => u.photos, { onDelete: 'CASCADE' })
    user: User;
}
