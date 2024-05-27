/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
import 'source-map-support/register';
import './module-alias';
import { Server } from 'socket.io';
import passport from 'src/passport';

import { createApp } from 'src/app';

/**
 * Start an Express server and installs signal handlers on the
 * process for graceful shutdown.
 */
(async () => {
    try {
        const { app, dependencies } = await createApp();
        const { activeUserModel, messageModel } = dependencies;

        const server = app.listen(app.get('port'), () => {
            console.log(`Started express server on PORT ${app.get('port')}`);
        });

        const io = new Server(server, {
            cors: {
                origin: ['*']
            }
        });

        io.engine.use((req: any, res: any, next: any) => {
            // eslint-disable-next-line no-underscore-dangle
            const isHandshake = req._query.sid === undefined;
            if (isHandshake) {
                passport.authenticate('jwt', { session: false })(req, res, next);
            } else {
                next();
            }
        });

        io.on('connection', async (socket: any) => {
            const { user } = socket.request;

            socket.on('new-user-add', (newUserName: any) => {
                // if user is not added previously
                console.log('New User Connected', newUserName, 'roomid: ', user.roomid);
                socket.join(user.roomid);
                activeUserModel.create({
                    username: newUserName,
                    roomid: user.roomid
                });
            });

            socket.on('disconnect', () => {
                // remove user from active users
                activeUserModel.delete({
                    username: user.username
                });
                console.log('User Disconnected', user.username);
            });

            socket.on('send-message', async (msg: any) => {
                const payload = {
                    roomid: user.roomid,
                    username: user.username,
                    message: msg
                };

                console.log(`a new message in ${payload.roomid} from ${payload.username}: ${payload.message}`);
                const createMessage = await messageModel.create(payload);

                io.to(user.roomid).emit('recieve-message', JSON.stringify(payload), createMessage.id);
            });

            if (!socket.recovered) {
                const query = socket.handshake.auth.serverOffset
                    ? {
                        _id: { $gt: socket.handshake.auth.serverOffset },
                        roomid: user.roomid
                    }
                    : { roomid: user.roomid };

                const getHangingMessage = await messageModel.find(query);

                getHangingMessage.forEach( (el: any) => {
                    io.to(user.roomid).emit('recieve-message', JSON.stringify(el), el.id);
                });

                // for (let i = 0; i < getHangingMessage.length; i++) {
                //     const message = getHangingMessage[i];
                //     io.to(user.roomid).emit('recieve-message', JSON.stringify(message), message.id);
                // }
            }
        });
    } catch (err) {
        console.log('error caught in server.ts');
    }
})();
