import { Request, NextFunction, Response } from 'express';
import { ErrorCodeMap } from 'src/libs/errors';

export const errorHandler = () => {
    // This is an express error handler, need to the 4 variable signature
    // eslint-disable-next-line
    return (err: any, req: Request, res: Response, next: NextFunction) => {
        // handle any if error code not there
        const statusCode = Number(ErrorCodeMap[err.error_code]);

        console.log('unexpected error');

        if (statusCode < 500) {
            return res.status(statusCode).send({
                error_code: err.error_code,
                message: err.message
            });
        }

        const Error500 = {
            error_code: 'SERVER_ERROR',
            message: 'Something unexpected happened, we are investigating this issue right now'
        };

        return res.status(500).send(Error500);
    };
};
