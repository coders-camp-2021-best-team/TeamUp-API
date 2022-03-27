import { Server, Socket } from 'socket.io';

export type WebsocketConnectionHandler = (io: Server, socket: Socket) => void;
