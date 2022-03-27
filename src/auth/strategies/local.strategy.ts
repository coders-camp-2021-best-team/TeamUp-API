import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

export const LocalStrategy = new Strategy(async (username, password, done) => {
    try {
        const user = await AuthService.login(username, password);

        return done(null, user);
    } catch {
        return done(null, false);
    }
});
