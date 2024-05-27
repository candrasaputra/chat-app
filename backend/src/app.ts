/* eslint-disable import/no-extraneous-dependencies */
import express, { Application, NextFunction, Request, RequestHandler, Response } from 'express';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'src/passport';
import { PORT } from 'src/config';
import { errorHandler } from 'src/controllers/middlewares/handle-error-code';

import { init } from 'src/init';
/**
 * Setup the application routes with controllers
 * @param app
 */
async function setupRoutes(app: Application, dependencies: any) {
    const { rootController, authController, messageController } = dependencies;

    app.use('/auth', authController.getRouter());
    app.use('/message', messageController.getRouter());
    app.use('/', rootController.getRouter());
}

/**
 * Main function to setup Express application here
 */
export async function createApp(): Promise<any> {
    const app = express();
    app.set('port', PORT);
    app.use(helmet() as RequestHandler);
    app.use(compression());
    app.disable('x-powered-by');
    app.use(bodyParser.json() as RequestHandler);
    app.use(passport.initialize());
    app.use(bodyParser.urlencoded({ extended: true }) as RequestHandler);

    // Set Content-Security-Policy
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
        return next();
    });

    // This should be last, right before routes are installed
    // so we can have access to context of all previously installed
    // middlewares inside our routes to be logged
    app.use(httpContext.middleware);

    // cors config
    app.use(
        cors({
            origin: ['*'],
            exposedHeaders: ['x-csrf-token']
        })
    );

    app.use((req, res, next) => {
        req.headers.origin = req.headers.origin || req.headers.host;
        next();
    });

    const dependencies = await init();
    await setupRoutes(app, dependencies);

    // In order for errors from async controller methods to be thrown here,
    // you need to catch the errors in the controller and use `next(err)`.
    // See https://expressjs.com/en/guide/error-handling.html
    app.use(errorHandler());

    return { app, dependencies };
}
