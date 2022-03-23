import { CreateMessageDto, ChatRoom, Message, MessageStatusDto } from '.';
import { User } from '../user';
import { UserStatusDto } from './dto';

export const ChatService = new (class {
    getUserChatRooms(userID: string) {
        return ChatRoom.find({
            where: [
                { recipient1: { id: userID } },
                { recipient2: { id: userID } }
            ],
            relations: ['recipient1', 'recipient2']
        });
    }

    checkIfUserInChatRoom(userID: string, chatroom?: ChatRoom) {
        return [chatroom?.recipient1?.id, chatroom?.recipient2?.id].includes(
            userID
        );
    }

    getChatRoom(roomID: string) {
        return ChatRoom.findOne(roomID, {
            relations: ['recipient1', 'recipient2']
        });
    }

    async getUserRoomWithUser(currentUserID: string, targetUserID: string) {
        const rooms = await this.getUserChatRooms(currentUserID);

        return rooms.find((r) =>
            [r.recipient1.id, r.recipient2.id].includes(targetUserID)
        );
    }

    async getUserChatRoom(userID: string, roomID: string) {
        const room = await this.getChatRoom(roomID);

        return this.checkIfUserInChatRoom(userID, room) ? room : null;
    }

    getChatRoomMessages(roomID: string, skip = 0) {
        return Message.find({
            where: {
                chatroom: { id: roomID }
            },
            relations: ['chatroom'],
            order: { createdOn: 'DESC' },
            take: 50,
            skip
        });
    }

    async createMessage(userID: string, data: CreateMessageDto) {
        const user = await User.findOne(userID);
        if (!user) return null;

        const room = await this.getChatRoom(data.roomID);
        if (!room) return null;

        const user_in_room = this.checkIfUserInChatRoom(userID, room);
        if (!user_in_room) return null;

        const message = new Message();
        message.chatroom = room;
        message.author = user;
        message.content = data.content;
        return message.save();
    }

    async sendUserStatus(userID: string, { activity_status }: UserStatusDto) {
        const user = await User.findOne(userID);
        if (!user) return null;

        user.activity_status = activity_status;
        await user.save();

        return user;
    }

    async sendMessageStatus(userID: string, data: MessageStatusDto) {
        const { status, roomID } = data;

        const chatroom = await this.getUserChatRoom(userID, roomID);
        if (!chatroom) return null;

        const user = [chatroom.recipient1, chatroom.recipient2].find(
            (u) => u.id === userID
        );
        if (!user) return null;

        return {
            user,
            chatroom,
            status
        };
    }
})();
