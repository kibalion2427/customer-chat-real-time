import React, { useState, useRef, useEffect } from "react";
import "./messages";
import "./clientChat.css";
import Messages from "./messages";
import ChatSocketService from "../../services/socket/ChatSocketService";

const ClientChat = ({ userId, admin }) => {
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
      toUserId: admin,
    });
    inputArea.current.value = "";
  };

  const sendAndUpdateMessages = (messagePacket) => {
    console.log("messagePacket", messagePacket);
    try {
      console.log("prev conversations", state);
      ChatSocketService.sendMessage(messagePacket);
      const temp = {
        ...state,
        conversations: [...state.conversations, messagePacket],
      };
      setState(temp);
    } catch (error) {
      alert("Cannot sent your message");
    }
  };

  useEffect(() => {
    ChatSocketService.receiveMessage();
    ChatSocketService.eventEmitter.on(
      "add-message-response",
      receiveSocketMessages
    );
  }, []);
  const receiveSocketMessages = (socketMessagePacket) => {
    console.log("received message", socketMessagePacket);
    console.log("prev conversations", state);
    const temp = {
      ...state,
      conversations: [...state.conversations, socketMessagePacket],
    };
    setState(temp);
  };

  return (
    <div className="contenedor-cliente">
      Chat Client
      {state.messageLoading ? <p>Cargando</p> : <p>OK</p>}
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

export default ClientChat;
