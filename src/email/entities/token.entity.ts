import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn
} from 'typeorm';

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

    @CreateDateColumn({ type: 'timestamp' })
    createdOn: Date;

    @ManyToOne(() => User, (u) => u.tokens, { onDelete: 'CASCADE' })
    user: User;

    isValid() {
        const interval_ms = new Date().getTime() - this.createdOn.getTime();
        const compare_ms = 8 * 60 * 60 * 1000;

        return interval_ms < compare_ms;
    }
}
