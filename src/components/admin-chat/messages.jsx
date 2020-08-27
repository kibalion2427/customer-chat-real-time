import React, { useRef } from "react";
import "./messages.css";

const Messages = ({ conversations, currentUserId }) => {
  const messageContainer = useRef();
  const alignMessages = (toUserId) => {
    return currentUserId !== toUserId;
  };
  const getMessageUI = () => {
    return (
      <ul ref={messageContainer} className="message-thread">
        {conversations.map((conversation, index) => (
          <li
            className={`${
              alignMessages(conversation.toUserId) ? "align-right" : "align-left"
            }`}
            key={index}
          >
            {" "}
            {conversation.message}{" "}
          </li>
        ))}
      </ul>
    );
  };
  const getInitiateConversationUI = () => {
    return <p>You haven't chatted yet, Say Hi</p>;
  };
  return (
    <div className="message-ui">
      {conversations.length > 0 ? getMessageUI() : getInitiateConversationUI()}
    </div>
  );
};

export default Messages;
