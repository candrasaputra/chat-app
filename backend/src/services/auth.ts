/* eslint-disable import/no-extraneous-dependencies */
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { ActiveUserModel } from 'src/models/active_users/index';
import { StandardError } from 'src/libs/standard-error';
import { ErrorCodes } from 'src/libs/errors';

interface IGenericObject {
    [key: string]: any;
}

export class AuthService {
    private activeUserModel: ActiveUserModel;

    constructor(activeUserModel: ActiveUserModel) {
        this.activeUserModel = activeUserModel;
    }

    public async login(roomid: string, username: string): Promise<IGenericObject> {
        if (!username) {
            throw new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'Username is required', {}, { username });
        }

        if (!roomid) {
            throw new StandardError(ErrorCodes.API_VALIDATION_ERROR, 'Roomid is required', {}, { roomid });
        }

        const activeUser = await this.activeUserModel.find({
            username
        });

        if (activeUser.length > 0) {
            throw new StandardError(ErrorCodes.LOGIN_REJECT, 'Username already taken', {}, { username });
        }

        const token = jwt.sign(
            {
                data: {
                    roomid,
                    username
                }
            },
            JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        return {
            token
        };
    }
}
