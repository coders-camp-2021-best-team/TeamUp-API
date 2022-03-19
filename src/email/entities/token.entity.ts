import { BaseEntity, PrimaryColumn, Column, ManyToOne, Entity } from 'typeorm';
import { User } from '../../user';

export enum TokenType {
    PASSWORD_RESET = 'PASSWORD_RESET',
    VERIFY_EMAIL = 'VERIFY_EMAIL'
}

@Entity('user_tokens')
export class Token extends BaseEntity {
    @PrimaryColumn()
    token: string;

    @Column('enum', {
        enum: TokenType
    })
    token_type: TokenType;

    @ManyToOne(() => User, (u) => u.tokens)
    user: User;
}