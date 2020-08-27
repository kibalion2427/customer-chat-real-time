import React, { useState, useRef, useEffect } from "react";
import "./messages";
import "./adminChat.css";
import Messages from "./messages";
import ChatSocketService from "../../services/socket/ChatSocketService";
import TextareaAutosize from "react-textarea-autosize";

const AdminChat = ({ userId }) => {
  const textareaRef = useRef();
  const [message, setMessage] = useState(null);
  const [conversations, setConversations] = useState([]);

  const handleInputChange = (e) => {
    // const target = e.target;
    // textareaRef.current.style.height = "30px";
    // textareaRef.current.style.height = `${target.scrollHeight}px`;
    setMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendAndUpdateMessages({
      fromUserId: userId,
      message: message.trim(),
      toUserId: "5f44773963e20927cb7246ac",
    });
    textareaRef.current.value = "";
  };

  const sendAndUpdateMessages = (messagePacket) => {
    try {
      ChatSocketService.sendMessage(messagePacket);
      setConversations((conversations) => [...conversations, messagePacket]);
      console.log("my conversations", conversations);
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
    <div className="message-wrapper">
      <div className="message-container">
        <Messages conversations={conversations} currentUserId={userId} />
      </div>
      <div className="message-typer">
        {/* <form className="form-inline form-typer"> */}
        <TextareaAutosize
          name="message"
          className="text-area-message"
          onChange={handleInputChange}
          ref={textareaRef}
          // value={message}
          // placeholder="Type a message"
          minRows={2}
        >
          {/* <div contenteditable="plaintext-only"></div> */}
        </TextareaAutosize>
        <button onClick={handleSendMessage} className="btn-send-message">
          Send
        </button>
        {/* </form> */}
      </div>
    </div>
  );
};

export default AdminChat;
