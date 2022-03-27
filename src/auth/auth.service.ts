import { compareSync, hashSync } from 'bcryptjs';
import { randomBytes } from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';

import env from '../config';
import { EmailService, Token, TokenType } from '../email';
import { User, UserRegisterStatus, UserStatus } from '../user';
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
                user.status !== UserStatus.ACTIVE ||
                user.registerStatus !== UserRegisterStatus.VERIFIED ||
                !this.verifyPassword(password, user.passwordHash)
            ) {
                throw new Error();
            }

            return user;
        } catch {
            throw new Error();
        }
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

    getWebsocketJWT(userID: string) {
        return jwt.sign({}, JWT_PRIVATE_KEY, {
            subject: userID,
            algorithm: JWT_ALGORITHM,
            expiresIn: NODE_ENV !== 'development' ? 10 : 60
        } as SignOptions);
    }

    verifyWebsocketJWT(token: string) {
        try {
            return jwt.verify(token, JWT_PUBLIC_KEY, {
                algorithms: [
                    'RS256',
                    'RS384',
                    'RS512',
                    'ES256',
                    'ES384',
                    'ES512'
                ]
            });
        } catch {
            return null;
        }
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

export const verifyWebsocketJWT = (token: string) => {
    return jwt.verify(token, JWT_PUBLIC_KEY, {
        algorithms: ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512']
    });
};
