import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assets')
export class Asset extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    etag: string;
}
