import React, { useRef } from "react";

const Messages = ({ conversations }) => {
  const messageContainer = useRef();
  // console.log("message Component",conversations)
  const getMessageUI = () => {
    return (
      <ul ref={messageContainer}>
        {conversations.map((conversation, index) => (
          <li key={index}>
            {""}
            {conversation.message}
          </li>
        ))}
      </ul>
    );
  };
  const getInitiateConversationUI = () => {
    return <p>You haven't chatted yet, Say Hi</p>;
  };
  return (
    <div className="">
      {conversations.length > 0 ? getMessageUI() : getInitiateConversationUI()}
    </div>
  );
};

export default Messages;
