import React, { useState, useRef, useEffect } from "react";
import {
  addResponseMessage,
  deleteMessages,
  toggleMsgLoader,
  Widget,
} from "react-chat-widget";
import Messages from "./messages";
import ChatSocketService from "../../services/socket/ChatSocketService";
import { getTime } from "../../helpers/date";
import "./messages";
import "./clientChat.css";
import "react-chat-widget/lib/styles.css";

const ClientChat = ({ userId, adminUserId }) => {
  const inputArea = useRef();
  const [message, setMessage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const isTypingRef = useRef(isTyping);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendAndUpdateMessages({
      fromUserId: userId,
      message: message.trim(),
      toUserId: adminUserId,
      time: getTime(new Date(Date.now())),
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
    addResponseMessage(socketMessagePacket.message);
  };

  const handleTyping = (e) => {
    if (e.keyCode !== 13) {
      setLastUpdateTime(Date.now());
      if (!isTyping) {
        setIsTyping(true);
        // ChatSocketService.sendIsTyping({ userId, isTyping:!isTyping });
        startCheckingTyping();
      }
    }
  };
  const startCheckingTyping = () => {
    // console.log("Typing");
    const typingInterval = setInterval(() => {
      if (Date.now() - lastUpdateTime > 3000) {
        setIsTyping(false);
        stopCheckingTyping(typingInterval);
      }
    }, 3000);
  };

  const stopCheckingTyping = (intervalID) => {
    // console.log("Stop Typing");
    if (intervalID) {
      clearInterval(intervalID);
    }
  };

  const emmitTypingEvent = (isTyping) => {
    if (isTyping) {
      ChatSocketService.sendIsTyping({ userId, isTyping });
    } else {
      ChatSocketService.sendIsTyping({ userId, isTyping: false });
    }
  };

  useEffect(() => {
    ChatSocketService.receiveMessage();
    ChatSocketService.eventEmitter.on(
      "add-message-response",
      receiveSocketMessages
    );
    return () => {
      ChatSocketService.eventEmitter.off(
        "add-message-response",
        receiveSocketMessages
      );
    };
  }, []);

  /**
   * This effect allows emmit a typing event trought a socket
   *
   */
  useEffect(() => {
    emmitTypingEvent(isTyping);
  }, [isTyping]);

  const handleNewUserMessage = (newMessage) => {
    // console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
    sendAndUpdateMessages({
      fromUserId: userId,
      message: newMessage,
      toUserId: adminUserId,
      time: getTime(new Date(Date.now())),
    });
  };
  return (
    <div className="contenedor-cliente">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        handleTextInputChange={handleTyping}
      />
      {/* <p>Chat Client</p>
      <Messages conversations={conversations} />
      <div className="send-message-container">
        <input
          type="text"
          name="message"
          id="message"
          onChange={handleInputChange}
          ref={inputArea}
          onKeyUp={handleTyping}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div> */}
    </div>
  );
};

export default ClientChat;
