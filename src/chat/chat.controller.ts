import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';

import { AuthService } from '../auth';
import {
    AuthMiddleware,
    BadRequestException,
    Controller,
    HttpException,
    InternalServerErrorException,
    UnauthorizedException,
    validate,
    WebsocketMiddleware
} from '../common';
import env from '../config';
import logger from '../logger';
import { User } from '../user';
import {
    ChatService,
    CreateMessageDto,
    JoinChatRoomDto,
    MessageStatusDto,
    UserStatusDto,
    UserSubscribeDto
} from '.';
const { NODE_ENV, JWT_INSECURE } = env;

declare module 'socket.io/dist/socket' {
    interface Handshake {
        user: User;
        raw_token: string;
    }
}

export type Ack = (resOrError?: unknown) => void;

export class ChatController extends Controller {
    constructor() {
        super('/chat');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/rooms', this.getChatRooms);
    }

    async getChatRooms(req: Request, res: Response) {
        const rooms = await ChatService.getUserChatRooms(req.user!);

        return res.send(instanceToPlain(rooms));
    }

    static websocketAuthMiddleware: WebsocketMiddleware = async (
        socket,
        next
    ) => {
        try {
            if (!socket.handshake.auth.token) {
                const parts =
                    socket.handshake.headers.authorization?.split(' ');

                if (!parts || parts.length !== 2 || parts[0] !== 'Bearer') {
                    throw new BadRequestException();
                }

                socket.handshake.auth.token = parts[1];
            }

            const raw_token: string = socket.handshake.auth.token;
            const decoded_token = AuthService.verifyWebsocketJWT(raw_token);
            if (typeof decoded_token !== 'object') {
                throw new BadRequestException();
            }

            const iat = decoded_token.iat || 0;
            const exp = decoded_token.exp || 0;

            if (Object.keys(decoded_token).length !== 3 || exp - iat > 60) {
                logger.warn(`suspicious jwt detected ${raw_token}`);

                if (NODE_ENV !== 'development' && JWT_INSECURE === false) {
                    throw new BadRequestException();
                }

                logger.warn(
                    'allowing to connect, because JWT_INSECURE=true or NODE_ENV=development'
                );
            }

            const userID = decoded_token.sub || '';
            const user = await User.findOneOrFail(userID);

            socket.handshake.user = user;
            socket.handshake.raw_token = raw_token;

            return next();
        } catch {
            return next(new UnauthorizedException());
        }
    };

    static async onWebsocketConnection(io: Server, socket: Socket) {
        const { user } = socket.handshake;

        const handleError = (err: unknown, ack: Ack) => {
            if (err instanceof HttpException) {
                ack({
                    code: err.code,
                    error: err.error
                });
            } else {
                ack(new InternalServerErrorException());

                logger.error(err);
            }
        };

        const handleSuccess = (ack: Ack) => {
            ack({ code: 200 });
        };

        await socket.join(`user.${user.id}`);
        io.in(`user.${user.id}`).emit('user.status', instanceToPlain(user));

        socket.prependAny((_, data, ack: Ack) => {
            if (typeof data !== 'object' || typeof ack !== 'function') {
                return socket.disconnect(true);
            }
        });

        socket.on('user.status.send', async (data, ack: Ack) => {
            try {
                const body = validate(UserStatusDto, data);

                const status = await ChatService.sendUserStatus(user, body);

                io.in(`user.${user.id}`).emit(
                    'user.status',
                    instanceToPlain(status)
                );

                handleSuccess(ack);
            } catch (err) {
                handleError(err, ack);
            }
        });

        socket.on('user.status.subscribe', async (data, ack: Ack) => {
            try {
                const { userID: targetUserID } = validate(
                    UserSubscribeDto,
                    data
                );

                const room = await ChatService.getUserRoomWithUser(
                    user,
                    targetUserID
                );

                const targetUser = [room.recipient1, room.recipient2].find(
                    (u) => u.id === targetUserID
                )!;

                socket.join(`user.${targetUserID}`);
                socket.emit('user.status', targetUser);

                handleSuccess(ack);
            } catch (err) {
                handleError(err, ack);
            }
        });

        socket.on('user.status.unsubscribe', async (data, ack: Ack) => {
            try {
                const { userID: targetUserID } = validate(
                    UserSubscribeDto,
                    data
                );

                await socket.leave(`user.${targetUserID}`);

                handleSuccess(ack);
            } catch (err) {
                handleError(err, ack);
            }
        });

        socket.on('message.status.send', async (data, ack: Ack) => {
            try {
                const body = validate(MessageStatusDto, data);

                const status = await ChatService.sendMessageStatus(user, body);

                socket.broadcast
                    .in(`room.${status.chatroom.id}`)
                    .emit('message.status', instanceToPlain(status));

                handleSuccess(ack);
            } catch (err) {
                handleError(err, ack);
            }
        });

        socket.on('message.send', async (data, ack: Ack) => {
            try {
                const body = validate(CreateMessageDto, data);

                const sent = await ChatService.createMessage(user, body);

                io.in(`room.${sent.chatroom.id}`).emit(
                    'message',
                    instanceToPlain(sent)
                );

                handleSuccess(ack);
            } catch (err) {
                handleError(err, ack);
            }
        });

        socket.on('room.join', async (data, ack) => {
            try {
                const { roomID } = validate(JoinChatRoomDto, data);

                const room = await ChatService.getUserChatRoom(user, roomID);

                socket.join(`room.${roomID}`);

                const messages = await ChatService.getChatRoomMessages(room);
                room.messages = messages;

                socket.emit('room.details', instanceToPlain(room));

                handleSuccess(ack);
            } catch (err) {
                handleError(err, ack);
            }
        });

        socket.on('room.leave', async (data, ack) => {
            try {
                const { roomID } = validate(JoinChatRoomDto, data);

                await socket.leave(`room.${roomID}`);

                handleSuccess(ack);
            } catch (err) {
                handleError(err, ack);
            }
        });
    }
}
