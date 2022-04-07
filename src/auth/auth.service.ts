import { compareSync, hashSync } from 'bcryptjs';
import { randomBytes } from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';

import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '../common';
import env from '../config';
import { EmailService, Token, TokenType } from '../email';
import { User, UserAccountStatus } from '../user';
import { RegisterDto } from '.';
const { NODE_ENV, JWT_ALGORITHM, JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } = env;

export const AuthService = new (class {
    getUserByID(id: string) {
        return User.findOneOrFail(id);
    }

    getUser(usernameOrEmail: string) {
        return User.findOneOrFail({
            where: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        });
    }

    async login(usernameOrEmail: string, password: string) {
        try {
            const user = await this.getUser(usernameOrEmail);

            if (
                !user.isAbleToLogin() ||
                !this.verifyPassword(password, user.passwordHash)
            ) {
                throw new UnauthorizedException();
            }

            return user;
        } catch {
            throw new UnauthorizedException();
        }
    }

    async register(data: RegisterDto) {
        const user = User.create({
            email: data.email,
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            birthdate: data.birthdate,
            passwordHash: this.hashPassword(data.password)
        });

        try {
            await user.save();
        } catch {
            throw new ConflictException();
        }

        const verify_token = new Token();
        verify_token.token = this.generateRandomToken();
        verify_token.token_type = TokenType.VERIFY_EMAIL;
        verify_token.user = user;

        try {
            await verify_token.save();

            await EmailService.registrationEmail(
                data.email,
                data.username,
                verify_token.token
            );
        } catch {
            await user.remove();
            throw new InternalServerErrorException();
        }

        return user;
    }

    async activateUser(id: string) {
        const token = await Token.findOne(id, {
            relations: ['user']
        });
        if (!token) throw new NotFoundException();

        const user = token.user;

        await token.remove();

        user.account_status = UserAccountStatus.ACTIVE;

        return user.save();
    }

    async requestPasswordReset(email: string) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return;
        }

        const reset_token = new Token();
        reset_token.token = this.generateRandomToken();
        reset_token.token_type = TokenType.PASSWORD_RESET;
        reset_token.user = user;

        try {
            await reset_token.save();
        } catch {
            throw new InternalServerErrorException();
        }

        try {
            await EmailService.resetPasswordEmail(
                user.email,
                user.username,
                reset_token.token
            );
        } catch {
            await reset_token.remove();
            throw new InternalServerErrorException();
        }
    }

    async resetPassword(id: string, userPassword: string) {
        const token = await Token.findOne(id, {
            relations: ['user']
        });
        if (!token) {
            throw new NotFoundException();
        }
        if (!token.isValid()) {
            await token.remove();
            throw new NotFoundException();
        }

        const user = token.user;

        await token.remove();

        user.passwordHash = this.hashPassword(userPassword);

        return user.save();
    }

    getWebsocketJWT(userID: string) {
        return jwt.sign({}, JWT_PRIVATE_KEY, {
            subject: userID,
            algorithm: JWT_ALGORITHM,
            expiresIn: NODE_ENV !== 'development' ? 10 : 60 * 60
        } as SignOptions);
    }

    verifyWebsocketJWT(token: string) {
        return jwt.verify(token, JWT_PUBLIC_KEY, {
            algorithms: ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512']
        });
    }

    hashPassword(password: string) {
        return hashSync(password);
    }

    verifyPassword(password: string, passwordHash: string) {
        return compareSync(password, passwordHash);
    }

    generateRandomToken() {
        return randomBytes(64).toString('base64url');
    }
})();

export const verifyWebsocketJWT = (token: string) => {
    return jwt.verify(token, JWT_PUBLIC_KEY, {
        algorithms: ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512']
    });
};
