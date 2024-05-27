import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation} from "react-router-dom";
import { axiosBackendInstance } from "../../helper/axios";

const Login = (props) => {
    const location = useLocation();
    const state = location.state;
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [errorMassage, setErrorMassage] = useState('');
    const navigate = useNavigate();
    const axiosInstance = axiosBackendInstance();

    const handleLoginAction = async () => {
        setErrorMassage('');

        try {
            const {data} = await axiosInstance.post('/auth/login', {
                roomid: roomId,
                username: userName
              }, { 'origin': 'http://localhost:3000' });

            // set token
            localStorage.setItem('token', data.token);

            // go to chat tab
            navigate("/chat");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message ) {
                setErrorMassage(error.response.data.message)
                window.history.replaceState({}, document.title);
            }
        }
    }

    useEffect(() => {
        if (state && state.errorMessage) {
            setErrorMassage(state.errorMessage)
        }
      }, [state]);

    return (
      <div className="container">
          <div className="header">
              <span className="title">Join Chatroom</span>
          </div>
          <div className="input-box">
              <input type="text" className="login-input" id="userName" onChange={e => setUserName(e.target.value)} placeholder='Username' />
              <input type="text" className="login-input" id="roomId" onChange={e => setRoomId(e.target.value)}  placeholder='Room ID' />
              
              {
                errorMassage ? <div className="danger">{errorMassage}</div> : <></>
              }

              <button className="login-button margin-top" onClick={handleLoginAction}>JOIN</button>
          </div>
      </div>
    )
}

export default Login;