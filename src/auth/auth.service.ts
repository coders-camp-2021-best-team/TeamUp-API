import { compareSync, hashSync } from 'bcryptjs';
import { User } from '../user/user.entity';
import { LoginDto, RegisterDto } from './dto';

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
        try {
            const user = User.create({
                email: data.email,
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                birthdate: data.birthdate,
                passwordHash: this.hashPassword(data.password)
            });

            return await user.save();
        } catch {
            return null;
        }
    }

    getUserByEmail(email: string) {
        return User.findOne({
            where: { email }
        });
    }

    hashPassword(password: string) {
        return hashSync(password);
    }

    verifyPassword(password: string, passwordHash: string) {
        return compareSync(password, passwordHash);
    }
})();
