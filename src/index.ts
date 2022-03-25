import { AuthController } from './auth';
import { BlockController } from './block';
import { ChatController } from './chat';
import { API } from './common';
import { FeedController } from './feed';
import { GameController } from './game';
import { MatchController } from './match';
import { PostController } from './post';
import { ReportController } from './report';
import { SearchController } from './search';
import { SwipeController } from './swipe';
import { UserController } from './user';

const server = new API({
    middlewares: [],
    controllers: [
        new AuthController(),
        new BlockController(),
        new ChatController(),
        new FeedController(),
        new GameController(),
        new MatchController(),
        new PostController(),
        new ReportController(),
        new SearchController(),
        new SwipeController(),
        new UserController()
    ],
    onWebsocketConnection: ChatController.onWebsocketConnection,
    websocketMiddleware: ChatController.websocketAuthMiddleware
});

server.initialize();
