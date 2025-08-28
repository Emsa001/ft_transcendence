import { Message } from "@/database/models/Message/Message";
import { Op } from "sequelize";
import { MessageDTOType } from "shared";

export interface FindOptions {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
}

class ChatDBService {
    public async findChat(id1: number, id2: number, options: FindOptions): Promise<Message[]> {
        const chat = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender: id1, receiver: id2 },
                    { sender: id2, receiver: id1 },
                ],
            },
            ...options,
        });
        if (!chat) {
            return [];
        }
        return chat;
    }

    public async saveMessage(msg: MessageDTOType) {
        const message = await Message.create(msg);
        await message.save();
    }

}

const chatDBService = new ChatDBService();
export { chatDBService };
