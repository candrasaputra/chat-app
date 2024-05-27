import { RootController } from 'src/controllers/root';
import { AuthController } from 'src/controllers/auth';
import { MessageController } from 'src/controllers/message';
import { AuthService } from 'src/services/auth';
import { MessageService } from 'src/services/message';
import { Mongo } from 'src/libs/mongo';
import { MessageModel } from 'src/models/messages';
import { ActiveUserModel } from 'src/models/active_users';

/**
 * Initialize all ENV values and dependencies here so that they are re-usable across web servers
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function init(): Promise<Record<string, any>> {
    // Initiate connection to DB
    const mongo = new Mongo();
    await mongo.connect();

    // Model
    const activeUserModel = new ActiveUserModel();
    const messageModel = new MessageModel();

    // Service
    const authService = new AuthService(activeUserModel);
    const messageService = new MessageService(messageModel);

    // Controller
    const rootController = new RootController();
    const authController = new AuthController(authService);
    const messageController = new MessageController(messageService);

    return {
        rootController,
        authController,
        messageController,
        activeUserModel,
        messageModel
    };
}
