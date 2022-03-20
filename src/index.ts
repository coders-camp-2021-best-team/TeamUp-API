import { API } from './common';
import { AuthController } from './auth';
import { FeedController } from './feed';
import { ReportController } from './report';
import { SearchController } from './search';
import { SwipeController } from './swipe';
import { UserController } from './user';

const server = new API({
    middlewares: [],
    controllers: [
        new AuthController(),
        new FeedController(),
        new ReportController(),
        new SearchController(),
        new SwipeController(),
        new UserController()
    ]
});

server.initialize();
