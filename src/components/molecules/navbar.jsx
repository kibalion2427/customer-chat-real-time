// "use strict";
import React, { useEffect, useState } from "react";
import { NavLink, withRouter, useHistory } from "react-router-dom";
import { getAccessToken } from "../../helpers/accessToken";
import withAuth from "../atoms/withAuth";
import AuthHttpServer from "../../services/authentication/AuthHttpServer";
import ChatSocketService from "../../services/socket/ChatSocketService";

import "./navbar.css";

const Navbar = () => {
  const history = useHistory();
  const isAuth = !!getAccessToken();
  //   console.log(isAuth, getAccessToken());
   const [userId,setUserId] = useState(null)

  const [state, setState] = useState({ username: "" });

  const logout = async () => {
      console.log("logout navbar user:",userId)
    try {
      await AuthHttpServer.removeLocalStorage();
      ChatSocketService.logout({userId:userId})
        ChatSocketService.eventEmitter.on("logout-response",(loggedOut)=>{
            history.push("/")
        })
    } catch (error) {
      console.log(error);
      alert("App crashed");
      history.push("/");
    }
    
  };

  const establishSocketConnection = async () => {
      
    try {
        const responseUser = await AuthHttpServer.getUserId()//from localstorage
        if(responseUser){
            setUserId(responseUser)
        }
      const response = await AuthHttpServer.userSessionCheck(responseUser);//check if user isOnline = 'Y' in DB
      if (response.error) {
        history.push("/");
      } else {
        setState({ ...state, username: response.username });
        AuthHttpServer.setLocalStorage("username", response.username);
        // ChatSocketService.establishSocketConnection(responseUser);
      }
    } catch (error) {
      history.push("/");
    }
  };
  useEffect( () => {
    // console.log("useEffect")
    //check user session and set a socketId to user
    establishSocketConnection();
  }, []);

  return (
    <div className="nav">
      <header className="app-header">
        <nav className="navbar-expand-md">
          <h4>Hello {state.username}</h4>
        </nav>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="is-active"
              to="/home"
              exact
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="is-active"
              to="/admin"
              exact
            >
              Admin
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="is-active"
              exact
              to="/"
              onClick={logout}
            >
              logout
            </NavLink>
          </li>
        </ul>
      </header>
    </div>
  );
};

export default Navbar;
