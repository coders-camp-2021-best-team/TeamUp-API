import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Server, Socket } from 'socket.io';
// import { JwtPayload } from 'jsonwebtoken';
import { AuthMiddleware, Controller, WebsocketMiddleware } from '../common';
import { AuthService } from '../auth';
import { User } from '../user';
import {
    ChatService,
    JoinChatRoomDto,
    CreateMessageDto,
    MessageStatusDto,
    UserSubscribeDto,
    UserStatusDto
} from '.';
import logger from '../logger';

import env from '../config';
const { NODE_ENV, JWT_INSECURE } = env;

declare module 'socket.io/dist/socket' {
    interface Handshake {
        userID: string;
        raw_token: string;
        // decoded_token: JwtPayload;
    }
}
export class ChatController extends Controller {
    constructor() {
        super('/chat');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/rooms', this.getChatRooms);
    }

    async getChatRooms(req: Request, res: Response) {
        const rooms = await ChatService.getUserChatRooms(
            req.session.userID || ''
        );

        if (!rooms) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        return res.send(rooms);
    }

    static websocketAuthMiddleware: WebsocketMiddleware = (socket, next) => {
        const raw_token =
            socket.handshake.auth.token ||
            socket.handshake.headers.authorization;

        const decoded_token = AuthService.verifyWebsocketJWT(raw_token);

        if (!decoded_token || typeof decoded_token === 'string') {
            return next(new Error('Unauthorized'));
        }

        if (
            Object.keys(decoded_token).length !== 3 ||
            (decoded_token.exp || 0) - (decoded_token.iat || 0) > 60
        ) {
            logger.warn(`suspicious jwt detected ${raw_token}`);

            if (NODE_ENV !== 'development' && JWT_INSECURE === false) {
                return next(new Error('Unauthorized'));
            }

            logger.warn(
                'allowing to connect, because JWT_INSECURE=true or NODE_ENV=development'
            );
        }

        socket.handshake.userID = decoded_token.sub as string;
        socket.handshake.raw_token = raw_token;
        // socket.handshake.decoded_token = decoded_token;
        next();
    };

    static async onWebsocketConnection(io: Server, socket: Socket) {
        const userID = socket.handshake.userID;

        const user = await User.findOne(userID);
        if (!user) {
            socket.disconnect(true);
            logger.warn(
                `non-existent user tried to connect with valid jwt ${socket.handshake.raw_token}`
            );
        }

        await socket.join(`user.${userID}`);
        io.in(`user.${userID}`).emit('user.status', instanceToPlain(user));

        socket.on('user.status.send', async (data) => {
            const body = plainToInstance(UserStatusDto, data);
            if (typeof body !== 'object') {
                return socket.disconnect(true);
            }
            const errors = validateSync(body);
            if (errors.length) {
                return socket.disconnect(true);
            }

            const status = await ChatService.sendUserStatus(userID, body);

            if (!status) {
                return socket.disconnect(true);
            }

            io.in(`user.${userID}`).emit(
                'user.status',
                instanceToPlain(status)
            );
        });

        socket.on('user.status.subscribe', async (data) => {
            const body = plainToInstance(UserSubscribeDto, data);
            if (typeof body !== 'object') {
                return socket.disconnect(true);
            }
            const errors = validateSync(body);
            if (errors.length) {
                return socket.disconnect(true);
            }

            const targetUserID = body.userID;

            const room = await ChatService.getUserRoomWithUser(
                userID,
                targetUserID
            );

            if (!room) {
                return socket.disconnect(true);
            }

            socket.join(`user.${targetUserID}`);

            const targetUser = [room.recipient1, room.recipient2].find(
                (r) => r.id === targetUserID
            );
            socket.emit('user.status', targetUser);
        });

        socket.on('user.status.unsubscribe', async (data) => {
            const body = plainToInstance(UserSubscribeDto, data);
            if (typeof body !== 'object') {
                return socket.disconnect(true);
            }
            const errors = validateSync(body);
            if (errors.length) {
                return socket.disconnect(true);
            }

            const targetUserID = body.userID;

            socket.leave(`user.${targetUserID}`);
        });

        socket.on('message.status.send', async (data) => {
            const body = plainToInstance(MessageStatusDto, data);
            if (typeof body !== 'object') {
                return socket.disconnect(true);
            }
            const errors = validateSync(body);
            if (errors.length) {
                return socket.disconnect(true);
            }

            const status = await ChatService.sendMessageStatus(userID, body);
            if (!status) {
                return socket.disconnect(true);
            }

            socket.broadcast
                .in(`room.${status.chatroom.id}`)
                .emit('message.status', instanceToPlain(status));
        });

        socket.on('message.send', async (data) => {
            const body = plainToInstance(CreateMessageDto, data);
            if (typeof body !== 'object') {
                return socket.disconnect(true);
            }
            const errors = validateSync(body);
            if (errors.length) {
                return socket.disconnect(true);
            }

            const sent = await ChatService.createMessage(userID, body);

            if (!sent) {
                return socket.disconnect(true);
            }

            io.in(`room.${sent.chatroom.id}`).emit(
                'message',
                instanceToPlain(sent)
            );
        });

        socket.on('room.join', async (data) => {
            const body = plainToInstance(JoinChatRoomDto, data);
            if (typeof body !== 'object') {
                return socket.disconnect(true);
            }
            const errors = validateSync(body);
            if (errors.length) {
                return socket.disconnect(true);
            }

            const { roomID } = body;
            const room = await ChatService.getUserChatRoom(userID, roomID);
            if (!room) {
                return socket.disconnect(true);
            }

            socket.join(`room.${roomID}`);

            const messages = await ChatService.getChatRoomMessages(roomID);
            room.messages = messages;

            socket.emit('room.details', instanceToPlain(room));
        });

        socket.on('room.leave', async (data) => {
            const body = plainToInstance(JoinChatRoomDto, data);
            if (typeof body !== 'object') {
                return socket.disconnect(true);
            }
            const errors = validateSync(body);
            if (errors.length) {
                return socket.disconnect(true);
            }

            socket.leave(`room.${body.roomID}`);
        });
    }
}
