/* eslint-disable import/no-extraneous-dependencies */
import { NextFunction, Request, Response, Router } from 'express';
import { AuthService } from 'src/services/auth';
import { authenticate } from 'src/controllers/middlewares/authenticate';

export class AuthController {
    private readonly authService: AuthService;

    private router: Router;

    constructor(authService: AuthService) {
        this.authService = authService;

        this.router = Router();
        this.router.get('/self', authenticate, this.self.bind(this));
        this.router.post('/login', this.login.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    public async self(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            return res.status(200).json(req.user);
        } catch (error) {
            next(error);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { roomid, username } = req.body;

            const result = await this.authService.login(String(roomid), String(username));

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
