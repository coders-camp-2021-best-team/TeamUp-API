import { API } from './common';
import { ReportController } from './report';
import { AuthController } from './auth';
import { UserController } from './user';
import { GameController } from './game';
import { SwipeController } from './swipe/swipe.controller';
import { SearchController } from './search';
import { FeedController } from './feed/feed.controller';

const server = new API({
    middlewares: [],
    controllers: [
        new UserController(),
        new AuthController(),
        new ReportController(),
        new GameController(),
        new FeedController(),
        new SwipeController(),
        new SearchController()
    ]
});

server.initialize();
