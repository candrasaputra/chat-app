import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { axiosBackendInstance } from "../../helper/axios";
import { socketio } from "../../helper/socket";

const Chat = () => {
        const [roomId, setRoomId] = useState('TS001');
        const [userName, setUserName] = useState('');
        const [sendMessage, setSendMessage] = useState('');
        const [allMessages, setAllMessages] = useState([]);
        const [lastid, setLastid] = useState('');
        const navigate = useNavigate();
        const socket = useRef();
        const axiosInstance = axiosBackendInstance();

        useEffect(() => {
            const token = localStorage.getItem('token');

            if (userName !== '') {
                socket.current = socketio(token);
                socket.current.auth.serverOffset = lastid;
                socket.current.emit("new-user-add", userName);

                socket.current.on("recieve-message", (data, serverOffset) => {
                        const newData = JSON.parse(data);
                        setAllMessages(prevMessages => [...prevMessages, newData]);
                        socket.current.auth.serverOffset = serverOffset;
                    }
                );
            }
        }, [userName]);

        useEffect(() => {
            async function getUser() {
                try {
                    const token = localStorage.getItem('token');
    
                    const { data } = await axiosInstance.get('/auth/self', { 'headers': { 'Authorization':  `Bearer ${token}`}, 'origin': 'http://localhost:3000' });

                    const getMessages = await axiosInstance.get(`/message`, { 'headers': { 'Authorization':  `Bearer ${token}`}, 'origin': 'http://localhost:3000' });
                    setAllMessages(getMessages.data);
                    const lastId = (getMessages.data.length > 0) ? getMessages.data[getMessages.data.length - 1].id : '';
                    setLastid(lastId);
                    setUserName(data.username);
                    setRoomId(data.roomid);
                } catch (error) {
                    if(error.response && error.response.data && error.response.data.message) {
                        navigate("/login", { state: {errorMessage: error.response.data.message }});
                    }
                }
            }

            getUser();
          }, []);

        const sendMessageAction = () => {
            if (sendMessage!=='') {
              socket.current.emit("send-message", sendMessage);
            }

            setSendMessage('')
        }

        const handleExitAction = () => {
            // disconnect
            socket.current.disconnect();

            // set token
            localStorage.removeItem('token');
    
            // go to chat tab
            navigate("/login");
        }

        return (
            <div className="container">
                <div className="header">
                    <button onClick={handleExitAction} className="exit" aria-label="Exit Chat">Exit</button>
                    <span className="title">{roomId}</span>
                </div>
                <div className="chat-messages">
                    {
                        allMessages.map(msg => (
                            msg.username === userName ?
                                <div className="message sent">
                                    <div className="content">
                                        <div>{msg.message}</div>
                                    </div>
                                </div>
                             : <div className="message received">
                                <div className="message-username">{msg.username}</div>
                                <div className="content">
                                    <div>{msg.message}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="chat-input-container">
                    <div className="chat-input-wrapper">
                    <input type="text" className="chat-input" onKeyDown={(e) => ( e.keyCode === 13 ? sendMessageAction() : null )}  onChange={(e) => setSendMessage(e.target.value)} placeholder="Message here..." aria-label="Type your message" value={sendMessage} />
                    <button className="chat-input-button" onClick={sendMessageAction} type="submit" aria-label="Send message">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z"/>
                        </svg>
                    </button>
                    </div>
                </div>
            </div>
        )
}

export default Chat;
