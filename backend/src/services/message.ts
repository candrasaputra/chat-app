/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
import { MessageModel } from 'src/models/messages/index';

interface IGenericObject {
    [key: string]: any;
}

export class MessageService {
    private messageModel: MessageModel;

    constructor(messageModel: MessageModel) {
        this.messageModel = messageModel;
    }

    public async getAll(roomid: string, lastId: string): Promise<IGenericObject> {
        const query =
            lastId
                ? {
                    _id: { $gt: lastId },
                    roomid
                }
                : { roomid };

        const result = await this.messageModel.find(query);

        return result;
    }
}
