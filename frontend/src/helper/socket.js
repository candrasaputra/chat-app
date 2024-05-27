import { io } from "socket.io-client";

export const socketio = (token) => io(process.env.REACT_APP_BACKEND_SOCKET_URL, {
        extraHeaders: {
            authorization: `bearer ${token}`
        },
        auth: {
            serverOffset: ''
        }
    });