import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthHttpServer from "../../services/authentication/AuthHttpServer";
import AdminChat from "../../components/admin-chat/adminChat";
import ChatSocketService from "../../services/socket/ChatSocketService";
import "./Admin.css";

const Admin = () => {
  const history = useHistory();
  const [user, setUser] = useState({});
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

  useEffect(() => {
    establishSocketConnection();
  }, []);

  const getAdmiChatComponent = () => {
    return isOverlayVisible ? null : <AdminChat userId={userId} />;
  };
  return (
    <div className=" content">
      <div className="row chat-content">
        <div className="col-3 chat-list-container">
          <p>Chat-List</p>
        </div>
        <div className="col-9 chat-box-container">{getAdmiChatComponent()}</div>
      </div>
    </div>
  );
};

export default Admin;
