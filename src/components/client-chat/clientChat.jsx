"use strict";
import React, { useState, useRef, useEffect } from "react";
import "./messages";
// import "./clientChat.css";
import Messages from "./messages";
import ChatSocketService from "../../services/socket/ChatSocketService";

const ClientChat = ({ userId, adminUserId }) => {
  const inputArea = useRef();
  const [message, setMessage] = useState(null);
  const [conversations, setConversations] = useState([]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendAndUpdateMessages({
      fromUserId: userId,
      message: message.trim(),
      toUserId: adminUserId,
    });
    inputArea.current.value = "";
  };

  const sendAndUpdateMessages = (messagePacket) => {
    try {
      ChatSocketService.sendMessage(messagePacket);
      setConversations((conversations) => [...conversations, messagePacket]);
    } catch (error) {
      alert("Cannot sent your message");
    }
  };
  const receiveSocketMessages = (socketMessagePacket) => {
    setConversations((conversations) => [
      ...conversations,
      socketMessagePacket,
    ]);
  };

  useEffect(() => {
    ChatSocketService.receiveMessage();
    ChatSocketService.eventEmitter.on(
      "add-message-response",
      receiveSocketMessages
    );
    return () => {
      ChatSocketService.eventEmitter.removeListener(
        "add-message-response",
        receiveSocketMessages
      );
    };
  }, []);

  return (
    <div className="contenedor-cliente">
      Chat Client
      <Messages conversations={conversations} />
      <div className="send-message-container">
        <input
          type="text"
          name="message"
          id="message"
          onChange={handleInputChange}
          ref={inputArea}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ClientChat;
