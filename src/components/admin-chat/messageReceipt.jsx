import React, { useRef, useEffect } from "react";
import "./messages.css";

const MessageReceipt = ({ conversations, currentUserId,typingUserId }) => {
  const messageContainer = useRef(null);

  const alignMessages = (toUserId) => {
    return currentUserId !== toUserId;
  };

  const scrollMessageContainer = () => {
    if (messageContainer.current !== null) {
      try {
        messageContainer.current.scrollTop =
          messageContainer.current.scrollHeight;
      } catch (error) {
        console.warn(error);
      }
    }
  };

  useEffect(() => {
    scrollMessageContainer();
  }, [conversations]);

  const getMessageUI = () => {
    return (
      <>
      {/* <div> */}
      <ul ref={messageContainer} className="message-thread">
        {conversations.map((conversation, index) => (
          <li
            className={`${
              alignMessages(conversation.toUserId)
                ? "align-right"
                : "align-left"
            }`}
            key={index}
          >
            {" "}
            {conversation.message}{" "}
          </li>
        ))}
      </ul>
      {/* </div> */}
      <div className="typing-user">
      { typingUserId && `${typingUserId} is typing...`}
      </div>
      </>
    );
  };
  const getInitiateConversationUI = () => {
    return (
    <div className="initial-conversation-container">
    <p>Select a user to chat</p>
    </div>
    )
  };
  return (
    <div className="message-ui">
      {conversations.length > 0 ? getMessageUI() : getInitiateConversationUI()}
    </div>
  );
};

export default MessageReceipt;
