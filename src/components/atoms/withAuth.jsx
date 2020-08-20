import React from "react";
import { Redirect } from "react-router-dom";
import { getAccessToken } from "../../helpers/accessToken";

const withAuth = (Component) => {
  const AuthRoute = () => {
    const isAuth = !!localStorage.getItem("userid");
    // const isAuth = !!getAccessToken()
    console.log("isAuth", isAuth);
    if (isAuth) {
      return <Component />;
    } else {
      return <Redirect to="/" />;
    }
  };
  return AuthRoute;
};

export default withAuth;
