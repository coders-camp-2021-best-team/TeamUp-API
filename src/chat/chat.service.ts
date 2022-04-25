import { NotFoundException } from '../common';
import { User } from '../user';
import { ChatRoom, CreateMessageDto, Message, MessageStatusDto } from '.';
import { UserStatusDto } from './dto';

export const ChatService = new (class {
    async getChatRoom(roomID: string) {
        const room = await ChatRoom.findOne(roomID);
        if (!room) throw new NotFoundException();
        return room;
    }

    getUserChatRooms(user: User) {
        return ChatRoom.find({
            where: [{ recipient1: user }, { recipient2: user }]
        });
    }

    checkIfUserInChatRoom(userID: string, chatroom: ChatRoom) {
        return [chatroom.recipient1.id, chatroom.recipient2.id].includes(
            userID
        );
    }

    async getUserRoomWithUser(currentUser: User, targetUserID: string) {
        const rooms = await this.getUserChatRooms(currentUser);
        const room = rooms.find((r) =>
            this.checkIfUserInChatRoom(targetUserID, r)
        );
        if (!room) throw new NotFoundException();

        return room;
    }

    async getUserChatRoom(user: User, roomID: string) {
        const room = await this.getChatRoom(roomID);

        const memberof = this.checkIfUserInChatRoom(user.id, room);
        if (!memberof) throw new NotFoundException();

        return room;
    }

    getChatRoomMessages(chatroom: ChatRoom, skip = 0) {
        return Message.find({
            where: { chatroom },
            relations: ['chatroom', 'author'],
            order: { createdOn: 'DESC' },
            take: 50,
            skip
        });
    }

    async createChatRoom(user: User, target: User) {
        const chatroom = new ChatRoom();
        chatroom.recipient1 = user;
        chatroom.recipient2 = target;
        return chatroom.save();
    }

    async createMessage(user: User, data: CreateMessageDto) {
        const room = await this.getUserChatRoom(user, data.roomID);

        const message = new Message();
        message.chatroom = room;
        message.author = user;
        message.content = data.content;
        return message.save();
    }

    async sendUserStatus(user: User, { activity_status }: UserStatusDto) {
        user.activity_status = activity_status;
        return user.save();
    }

    async sendMessageStatus(user: User, data: MessageStatusDto) {
        const chatroom = await this.getUserChatRoom(user, data.roomID);

        return {
            user,
            chatroom,
            status: data.status
        };
    }
})();
