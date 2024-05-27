/* eslint-disable import/no-extraneous-dependencies */
import { NextFunction, Request, Response, Router } from 'express';
import { MessageService } from 'src/services/message';
import { authenticate } from 'src/controllers/middlewares/authenticate';

export class MessageController {
    private readonly messageService: MessageService;

    private router: Router;

    constructor(messageService: MessageService) {
        this.messageService = messageService;

        this.router = Router();
        this.router.get('/', authenticate, this.getAll.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    public async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { roomid } = req.user as any;
            const { lastid } = req.query;

            const result = await this.messageService.getAll(String(roomid), String(lastid || ''));

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
