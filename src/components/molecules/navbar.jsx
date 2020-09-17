// "use strict";
import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { getAccessToken } from "../../helpers/accessToken";
import AuthHttpServer from "../../services/authentication/AuthHttpServer";
import ChatSocketService from "../../services/socket/ChatSocketService";

import "./navbar.css";

const Navbar = () => {
  const history = useHistory();
  const isAuth = !!getAccessToken();
  const [userId, setUserId] = useState(null);
  const [state, setState] = useState({ username: "" });

  const logout = async () => {
    try {
      await AuthHttpServer.removeLocalStorage();
      ChatSocketService.logout({ userId: userId });
      ChatSocketService.eventEmitter.on("logout-response", (loggedOut) => {
        history.push("/");
      });
    } catch (error) {
      console.log(error);
      history.push("/");
    }
  };

  const establishSocketConnection = async () => {
    try {
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
      }
    } catch (error) {
      history.push("/");
    }
  };
  useEffect(() => {
    establishSocketConnection();
  }, []);

  return (
    <div className="">
      {/* <header className="app-header"> */}
      {/* <div className="content"> */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between app-header">
        <a
          className=" navbar-brand nav-logo"
          href={localStorage.getItem("isAdmin") === "true" ? "/admin" : "/home"}
        >
          {localStorage.getItem("isAdmin") === "true"
            ? "Administrator"
            : "Customer"}{" "}
        </a>
        <div className="">
          <ul className="navbar-nav mr-auto ">
            {/* <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="is-active"
              to={
                localStorage.getItem("isAdmin") === "true" ? "/admin" : "/home"
              }
              exact
            >
              Home
            </NavLink>
          </li> */}
            <li className="nav-item">
              <NavLink
                className="nav-link nav-text"
                // activeClassName="is-active"
                exact
                to="/"
                onClick={logout}
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      {/* </header> */}
    </div>
  );
};

export default Navbar;
