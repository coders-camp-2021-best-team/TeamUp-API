import { compareSync, hashSync } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { User, UserRegisterStatus, UserStatus } from '../user';
import { EmailService, Token, TokenType } from '../email';
import { LoginDto, RegisterDto } from '.';

export const AuthService = new (class {
    async login(data: LoginDto) {
        const user = await this.getUserByEmail(data.email);

        if (!user) {
            return null;
        }

        const ok = this.verifyPassword(data.password, user.passwordHash);
        if (!ok) {
            return null;
        }
        return user;
    }

    async register(data: RegisterDto) {
        const user = User.create({
            email: data.email,
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            birthdate: data.birthdate,
            passwordHash: this.hashPassword(data.password),
            registerStatus: UserRegisterStatus.UNVERIFIED
        });

        const userSave = await user.save();

        if (!userSave) {
            return null;
        }

        const verify_token = new Token();
        verify_token.token = randomBytes(64).toString('hex');
        verify_token.token_type = TokenType.VERIFY_EMAIL;
        verify_token.user = userSave;
        await verify_token.save();

        EmailService.registrationEmail(
            data.email,
            data.username,
            verify_token.token
        );

        return userSave;
    }

    getUserByEmail(email: string) {
        return User.findOne({
            where: {
                email,
                status: UserStatus.ACTIVE,
                registerStatus: UserRegisterStatus.VERIFIED
            }
        });
    }

    hashPassword(password: string) {
        return hashSync(password);
    }

    verifyPassword(password: string, passwordHash: string) {
        return compareSync(password, passwordHash);
    }
})();
