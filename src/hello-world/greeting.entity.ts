import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('greetings')
export class Greeting {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 512 })
    text: string;
}
