import { API } from './common';
import { ReportController } from './report';
import { AuthController } from './auth';
import { UserController } from './user';
import { GameController } from './game';
import { FeedController } from './feed/feed.controller';

const server = new API({
    middlewares: [],
    controllers: [
        new UserController(),
        new AuthController(),
        new ReportController(),
        new GameController(),
        new FeedController()
    ]
});

server.initialize();
