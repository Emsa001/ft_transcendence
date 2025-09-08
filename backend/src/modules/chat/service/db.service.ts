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
    public async findChat(
        id1: number,
        id2: number,
        options: FindOptions
    ): Promise<{ messages: Message[]; hasMore: boolean }> {
        const limit = options.limit ?? 20;
        const offset = options.offset ?? 0;

        const where: any = {
            [Op.or]: [
                { sender: id1, receiver: id2 },
                { sender: id2, receiver: id1 },
            ],
        };

        if (options.startDate) {
            where.createdAt = {
                ...(where.createdAt || {}),
                [Op.gte]: options.startDate,
            };
        }
        if (options.endDate) {
            where.createdAt = {
                ...(where.createdAt || {}),
                [Op.lte]: options.endDate,
            };
        }

        const messages = await Message.findAll({
            where,
            order: [["createdAt", "DESC"]],
            limit: limit + 1,
            offset,
        });

        const hasMore = messages.length > limit;
        return {
            messages: messages.reverse(),
            hasMore,
        };
    }
}

const chatDBService = new ChatDBService();
export { chatDBService };
