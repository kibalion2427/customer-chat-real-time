import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/home/Home";
import NotFound from "./pages/not-found/NotFound";
import Admin from "./pages/admin/Admin";
import Authentication from "./pages/authentication/Authentication";

function Routes() {
  return (
    <Router>
      <div>
        {/* <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link to="/register">Register</Link>
        </div> */}
        <Switch>
          <Route path="/" exact component={Authentication} />
          <Route path="/admin" component={Admin} />
          <Route path="/home" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default Routes;
