"use strict";
import React, { useState, useRef, useEffect } from "react";
import "./messages";
import "./adminChat.css";
import Messages from "./messages";
import ChatSocketService from "../../services/socket/ChatSocketService";

const AdminChat = ({ userId }) => {
  const [state, setState] = useState({
    messageLoading: true,
    conversations: [],
  });
  const inputArea = useRef();
  const handleInputChange = (e) => {
    // console.log("handle");
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const message = state.message;
    sendAndUpdateMessages({
      fromUserId: userId,
      message: message.trim(),
      //   toUserId: admin,
    });
    inputArea.current.value = "";
  };

  const sendAndUpdateMessages = (messagePacket) => {
    // console.log("messagePacket", messagePacket)
    try {
      ChatSocketService.sendMessage(messagePacket);
      setState({
        ...state,
        conversations: [...state.conversations, messagePacket],
      });
    } catch (error) {
      alert("Cannot sent your message");
    }
  };

  useEffect(() => {
    // ChatSocketService.receiveMessage();
    ChatSocketService.eventEmitter.on(
      "add-message-response",
      receiveSocketMessages
    );
  }, []);

  const receiveSocketMessages = (socketMessagePacket) => {
    console.log("received message", socketMessagePacket);
    setState({
      ...state,
      conversations: [...state.conversations, socketMessagePacket],
    });
  };

  return (
    <div className="contenedor-cliente">
      Chat Admin
      <Messages conversations={state.conversations} />
      <div className="send-message-container">
        <input
          type="text"
          name="message"
          id="message"
          onChange={handleInputChange}
          ref={inputArea}
          // onKeyPress={handleSendMessage}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AdminChat;
