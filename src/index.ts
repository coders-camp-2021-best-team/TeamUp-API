import { API } from './common';
import { AuthController } from './auth';
import { BlockController } from './block';
import { ChatController } from './chat';
import { GameController } from './game';
import { FeedController } from './feed';
import { ReportController } from './report';
import { SearchController } from './search';
import { SwipeController } from './swipe';
import { UserController } from './user';
import { MemeController } from './memes';

const server = new API({
    middlewares: [],
    controllers: [
        new AuthController(),
        new BlockController(),
        new ChatController(),
        new GameController(),
        new FeedController(),
        new ReportController(),
        new SearchController(),
        new SwipeController(),
        new UserController(),
        new MemeController()
    ],
    onWebsocketConnection: ChatController.onWebsocketConnection,
    websocketMiddleware: ChatController.websocketAuthMiddleware
});

server.initialize();
