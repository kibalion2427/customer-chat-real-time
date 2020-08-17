import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import decode from "jwt-decode"
import { FaUser, FaLock } from "react-icons/fa";
import Input from "../../../components/atoms/input";
import AuthHttpServer from "../../../services/AuthHttpServer";
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
    let response = "";
    try {
      response = await AuthHttpServer.login(state);
      if (response && response.userId){ 
        setAccessToken(response.accessToken)
        let decodedJWT  = decode(getAccessToken())
        AuthHttpServer.setLocalStorage("expiresIn", decodedJWT.exp);
      };
      console.log("TOKEN AFTER LOGIN", getAccessToken());
      AuthHttpServer.setLocalStorage("userid", response.userId);
      if (state.username === "admin") history.push("/admin");
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
      {/* <Input
        icon={<FaUser />}
        text="Username"
        type="text"
        style="input-div one"
        name="username"
      />
      <Input
        icon={<FaLock />}
        text="Password"
        type="password"
        style="input-div pass"
        name="password"
      /> */}
      <Button variant="primary" type="submit" onClick={handleLogin}>
        Ingresar
      </Button>
    </Form>
  );
};

export default Login;
