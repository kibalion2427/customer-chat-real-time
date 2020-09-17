import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from "./pages/home/Home";
import NotFound from "./pages/not-found/NotFound";
import Admin from "./pages/admin/Admin";
import Authentication from "./pages/authentication/Authentication";
import Navbar from "./components/molecules/navbar";
import { getAccessToken } from "./helpers/accessToken";
import { Role } from "./helpers/role";
import "./Routes.css"

const AdminRoute = ({ component: Component, roles, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const currentUser = localStorage.getItem("userid");
        //TODO check if user has permision using AuthAPI, not localstorage
        const isAdmin = Boolean(localStorage.getItem("isAdmin"));
        if (!currentUser) {
          //user is not logged in
          return <Redirect to={{ pathname: "/" }} />;
        }

        if (roles && localStorage.getItem("isAdmin") !== "true") {
          //user is not authorized
          return <Redirect to={{ pathname: "/" }} />;
        }

        //authorized to return components
        return (
          <div>
            <Navbar />
            <Component {...props} />
          </div>
        );
      }}
    />
  );
};
// TODO Decide if admin users will have access to not admin components
// Check Permissions using AuthAPI
const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  return (
    <Route
      {...rest}
      component={(props) => (
        <div>
          <Navbar />
          <Component {...props} />
        </div>
      )}
    />
  );
};

const PublicRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} component={(props) => <Component {...props} />} />;
};

function Routes() {
  const [loggedIn, setLoggedIn] = useState(getAccessToken());
  return (
    <Router>
      <Switch>
        <PublicRoute path="/" exact component={Authentication} />
        <AdminRoute path="/admin" roles={[Role.Admin]} component={Admin} />
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute component={NotFound} />
      </Switch>
    </Router>
  );
}

export default Routes;
