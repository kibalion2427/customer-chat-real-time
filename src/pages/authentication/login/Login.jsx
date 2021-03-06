import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import decode from "jwt-decode"
import { FaUser, FaLock } from "react-icons/fa";
import Input from "../../../components/atoms/input";
import AuthHttpServer from "../../../services/authentication/AuthHttpServer";
import { setAccessToken, getAccessToken } from "../../../helpers/accessToken";

import "./Login.css";

const Login = (props) => {
  const history = useHistory();
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const handleInputChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    // let response = "";
    try {
      const user = await AuthHttpServer.login(state);
      if (user && user.userId){ 
        setAccessToken(user.accessToken)
        // let decodedJWT  = decode(getAccessToken())
        // AuthHttpServer.setLocalStorage("expiresIn", decodedJWT.exp);
      };
      AuthHttpServer.setLocalStorage("userid", user.userId);
      AuthHttpServer.setLocalStorage("isAdmin", user.isAdmin);
      if (user.isAdmin) history.push("/admin");
      else history.push("/home");
    } catch (error) {
      console.log(error)
      alert("Error en login");
    }
  };

  return (
    <Form className="auth-form">
      <Form.Group controlId="loginUsername">
        <Form.Control
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="loginUsername">
        <Form.Control
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="off"
          onChange={handleInputChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleLogin}>
        Ingresar
      </Button>
    </Form>
  );
};

export default Login;
