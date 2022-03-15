import { compareSync, hashSync } from 'bcryptjs';
import { User, UserStatus } from '../user';
import { LoginDto, RegisterDto } from './dto';
import { EmailService } from '../email/email.service';

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
                passwordHash: this.hashPassword(data.password),
                status: UserStatus.BLOCKED
            });

            const userSave = await user.save();

            if (userSave) {
                EmailService.registrationEmail(data.email, data.username);
            }

            return userSave;
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
