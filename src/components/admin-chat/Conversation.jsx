import React, { useState, useRef, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { AdminChatContext } from "../../_context/AdminChatContext";
import ChatSocketService from "../../services/socket/ChatSocketService";
import Messages from "./messages";
import "./adminChat.css";
import ChatHttpService from "../../services/chat/ChatHttpService";

const Conversation = ({ userId }) => {
  const history = useHistory();
  const textareaRef = useRef();
  const [message, setMessage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useContext(AdminChatContext);
  const [messageloading, setMessageloading] = useState(false);
  const refSelectedUser = useRef(selectedUser);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  /**
   *
   * @param {e} events from click
   * This handler allows to send a new message to selected user Id
   */
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message === "" || !message) {
      return;
    }
    if (userId === "") {
      history.push("/");
    }
    if (!selectedUser) {
      alert("select a user to chat");
      return;
    }
    sendAndUpdateMessages({
      fromUserId: userId,
      message: message.trim(),
      // toUserId: "5f44773963e20927cb7246ac",
      toUserId: selectedUser.userId,
    });
    textareaRef.current.value = "";
    setMessage("");
  };

  const sendAndUpdateMessages = (messagePacket) => {
    try {
      ChatSocketService.sendMessage(messagePacket);
      setConversations((conversations) => [...conversations, messagePacket]);
    } catch (error) {
      alert("Cannot sent your message");
    }
  };
  /**
   *
   *
   * @param {*} socketMessagePacket
   * Esta función se activa si un usuario del chat list ya fue seleccionado
   * Permite renderizar conversaciones sólo del usuario seleccionado y no mezcla conversaciones
   */

  /**This handler updates the conversations comparing if the selected user_id in the chat list component is the same of the received socket message packet s */
  const receiveSocketMessages = (socketMessagePacket) => {
    if (
      refSelectedUser.current &&
      refSelectedUser.current.userId === socketMessagePacket.fromUserId
    ) {
      setConversations((conversations) => [
        ...conversations,
        socketMessagePacket,
      ]);
    }
  };

  /**
   * This effect suscribe and unsubscribe the eventEmitter listener
   */
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
   * This effect allows keeping the latest globalstate updated
   */
  useEffect(() => {
    refSelectedUser.current = selectedUser;
  });

  /**
   * This effect load conversation from DB when the selected user in the chat list change
   */

  useEffect(() => {
    async function fetchMessages() {
      try {
        const messageResponse = await ChatHttpService.getMessages(
          userId,
          selectedUser.userId
        );
        if (!messageResponse.error) {
          console.log("messages received", messageResponse.messages);
          setConversations(messageResponse.messages);
          
        } else {
          alert("Cannot fetch messages");
        }
        setMessageloading(false);
      } catch (error) {
        setMessageloading(false);
      }
    }
    fetchMessages();
  }, [selectedUser]);

  return (
    <div className="message-wrapper">
      <div className="message-container">
        <Messages conversations={conversations} currentUserId={userId} />
      </div>
      <div className="message-typer">
        <TextareaAutosize
          name="message"
          className="text-area-message"
          onChange={handleInputChange}
          ref={textareaRef}
          minRows={2}
        ></TextareaAutosize>
        <button onClick={handleSendMessage} className="btn-send-message">
          Send
        </button>
      </div>
    </div>
  );
};

export default Conversation;
