import { Server, Socket } from 'socket.io';
import logger from '../logger';
import { AuthMiddleware, Controller } from '../common';

export class ChatController extends Controller {
    constructor() {
        super('/chat');

        const router = this.getRouter();
        router.use(AuthMiddleware);
    }

    static onWebsocketConnection(io: Server, socket: Socket) {
        logger.debug(`user connected, id: ${socket.id}`);

        socket.on('disconnect', (reason) => {
            logger.debug(
                `user disconnected, id: ${socket.id}, reason: ${reason}`
            );
        });

        socket.on('message', (data) => {
            io.emit('message', data);
        });
    }
}
