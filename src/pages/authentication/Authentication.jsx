import React, { Component } from "react";
import styled from "styled-components";
import { Tabs, Tab } from "react-bootstrap";

import Login from "./login/Login";
import Registration from "./registration/Registration";
import wave from "../../images/wave.png";
import avatar from "../../images/avatar.svg";

import "./Authentication.css";

const Authentication = () => {
  return (
    <div>
      <img className="wave" src={wave} />
      <div className="container">
        <div className="img"></div>
        <div className="login-content">
          <div>
            <img src={avatar} />
            <h2 className="title">Howdy!!</h2>
            <TabContainer>
              <Tabs variant="pills" defaultActiveKey="login">
                <Tab eventKey="login" title="Inicia sesión">
                  <Login />
                </Tab>
                <Tab eventKey="registration" title="Regístrate">
                  <Registration />
                </Tab>
              </Tabs>
            </TabContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StyledWave = styled.img.attrs((props) => ({ src: props.img }))`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: -1;
`;
const StyledContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 7rem;
  padding: 0 2rem;
`;

const StyledLeftContent = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 500px;
`;

const StyledLoginContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  img {
    height: 100px;
  }
`;

const StyledForm = styled.form`
  width: 360px;
`;

const StyledTitle = styled.h2`
  margin: 15px 0;
  color: #333;
  /* text-transform: */
  font-size: 2.9rem;
`;

const TabContainer = styled.div`
  /* display: flexbox; */
  /* justify-content: center;
  align-items: center; */
  /* align-self: center;
  text-align: center; */
`;

export default Authentication;
