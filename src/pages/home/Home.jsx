import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ClientChat from "../../components/client-chat/clientChat";
import AuthHttpServer from "../../services/authentication/AuthHttpServer";
import ChatSocketService from "../../services/socket/ChatSocketService";

const Home = () => {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState({});
  const [state, setState] = useState({});
  const [adminUser, setAdminUser] = useState({});
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);


  const setRenderLoadingState = (loadingState) => {
    setIsOverlayVisible(loadingState);
  };
  const establishSocketConnection = async () => {
    try {
      setRenderLoadingState(true);
      console.log("get user by username api");
      const responseUser = await AuthHttpServer.getUserId(); //from localstorage
      const admin = await AuthHttpServer.getUserByUsername("admin");
      if (responseUser) {
        setUserId(responseUser);
      }
      if (userId) {
        setAdminUser(admin.user.userId);
      }
      const response = await AuthHttpServer.userSessionCheck(responseUser); //check if user isOnline = 'Y' in DB
      if (response.error) {
        history.push("/");
      } else {
        setState({ ...state, username: response.username });
        AuthHttpServer.setLocalStorage("username", response.username);
        ChatSocketService.establishSocketConnection(responseUser);
      }
      setRenderLoadingState(false);
    } catch (error) {
      setRenderLoadingState(false);
      history.push("/");
    }
  };
  useEffect(() => {
    establishSocketConnection();
  }, []);
  const getClientChatComponent=()=>{
    return isOverlayVisible ? null : <ClientChat userId={userId} adminUserId={adminUser} />
  }
  return (
    <div>
      {getClientChatComponent()}
    </div>
  );
};

export default Home;
