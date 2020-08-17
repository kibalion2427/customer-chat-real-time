import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

import AuthHttpServer from "../../../services/AuthHttpServer";
import { setAccessToken } from "../../../helpers/accessToken";

const Registration = () => {
  const history = useHistory();
  const [state, setState] = useState({
    username: "",
    password: "",
    usernameAvailable: true,
  });

  const handleInputChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const checkUsernameAvailability = async (username) => {
    if (username) {
      setState({ ...state, username });
      try {
        const response = await AuthHttpServer.checkUsernameAvailability(
          state.username
        );

        response.error
          ? setState({ ...state, usernameAvailable: false })
          : setState({ ...state, usernameAvailable: true });
        return response;
      } catch (error) {
        setState({ ...state, usernameAvailable: false });

        return false;
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      checkUsernameAvailability(state.username).then(async (response) => {
        if (response && !response.error) {
          const responseRegister = await AuthHttpServer.register(state);
          if (responseRegister.error) {
            alert("Intenta más tarde, error al registrarse");
          } else {
            if (responseRegister) setAccessToken(responseRegister.accessToken);
            if (state.username === "admin") history.push("/admin");
            else history.push("/home");
          }
        } else {
          alert("El usuario no está disponible");
        }
      });
    } catch (error) {
      alert("Intenta más tarde, error al registrarse");
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
      <Button variant="primary" type="submit" onClick={handleRegister}>
        Registrarme
      </Button>
    </Form>
  );
};

export default Registration;
