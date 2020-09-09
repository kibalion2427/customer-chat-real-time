import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {AdminChatProvider} from "../../_context/AdminChatContext"
import AuthHttpServer from "../../services/authentication/AuthHttpServer";
import Conversation from "../../components/admin-chat/Conversation";
import ChatSocketService from "../../services/socket/ChatSocketService";
import ChatList from "../../components/chatList/chatList";

import "./Admin.css";

//TODO CHATLIST
//TODO Complete styles on navbar
//TODO push to /admin or /home component if the user is already logged up and the url is "/"
const Admin = () => {
  const history = useHistory();
  const [userId, setUserId] = useState({});
  const [state, setState] = useState({});
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const establishSocketConnection = async () => {
    try {
      setIsOverlayVisible(true);
      const responseUser = await AuthHttpServer.getUserId(); //from localstorage
      if (responseUser) {
        setUserId(responseUser);
      }
      const response = await AuthHttpServer.userSessionCheck(responseUser); //check if user isOnline = 'Y' in DB
      if (response.error) {
        history.push("/");
      } else {
        setState({ ...state, username: response.username });
        AuthHttpServer.setLocalStorage("username", response.username);
        ChatSocketService.establishSocketConnection(responseUser);
      }
      setIsOverlayVisible(false);
    } catch (error) {
      setIsOverlayVisible(false);
      history.push("/");
    }
  };

  // const updateSelectedUser = (user) => {
  //   setSelectedUser(user);
  // };
  const getConversationComponent = () => {
    return isOverlayVisible ? null : (
      <Conversation userId={userId}/>
    );
  };

  const getChatListComponent = () => {
    return isOverlayVisible ? null : (
      <ChatList userId={userId} />
    );
  };

  useEffect(() => {
    establishSocketConnection();
  }, []);
  return (
    <AdminChatProvider>
    <div className=" content">
      <div className="row chat-content">
        <div className="col-3 chat-list-container">
          {getChatListComponent()}
        </div>
        <div className="col-9 chat-box-container">
          {getConversationComponent()}
        </div>
      </div>
    </div>
    </AdminChatProvider>
  );
};

export default Admin;
