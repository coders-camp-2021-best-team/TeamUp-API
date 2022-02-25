import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assets')
export class Asset {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    etag: string;
}
