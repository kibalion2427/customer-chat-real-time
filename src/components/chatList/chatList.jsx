import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ChatSocketService from "../../services/socket/ChatSocketService";
import AuthHttpServer from "../../services/authentication/AuthHttpServer";
import "./chatList.css";
import ChatHttpService from "../../services/chat/ChatHttpService";
import ContactContainer from "./contactContainer";

const ChatList = ({ userId, updateSelectedUser }) => {
  const [chatListUsers, setChatListUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const getUserId = async (userId) => {
    try {
      const userResponseId = await AuthHttpServer.getUserById(userId);
      if (userResponseId) {
        return userResponseId;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  };
  const editSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const createChatListUsers = async (socketMessagePacket) => {
    try {
      if (!socketMessagePacket.error) {
        const response = await getUserId(socketMessagePacket.fromUserId);
        if (response) {
          // console.log("response-chat",response.user);
          setChatListUsers((chatListUsers) => [
            ...chatListUsers,
            response.user,
          ]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Effect to filter contacts
   */

  useEffect(() => {
    const result = chatListUsers.filter((user) => {
      return user.username.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredData(result);
  }, [searchTerm]);

  /**
   * This effect allow to push a customer user to admin chat-list, each time the customer send a message
   */

  useEffect(() => {
    ChatSocketService.eventEmitter.on(
      "add-message-response",
      createChatListUsers
    );
    return () => {
      ChatSocketService.eventEmitter.off(
        "add-message-response",
        createChatListUsers
      );
    };
  }, []);

  /**
   * This effect allows to load chat list from previous conversations
   */
  useEffect(() => {
    async function getChatList() {
      try {
        const chatListResponse = await ChatHttpService.getChatList(userId);
        if (chatListResponse) {
          chatListResponse.chatList.map(async (item, index) => {
            const response = await getUserId(item._id);
            if (response) {
              setChatListUsers((chatListUsers) => [
                ...chatListUsers,
                response.user,
              ]);
              setFilteredData((chatListUsers) => [
                ...chatListUsers,
                response.user,
              ]);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    getChatList();
  }, []);

  return (
    <div>
      <h2>Chats</h2>
      <div className="input-finder-icon">
        <input
          type="text"
          value={searchTerm}
          placeholder="Find a Chat"
          className="col-12 search-input"
          onChange={editSearchTerm}
        />
        <FaSearch className="input-icon" />
      </div>
      {chatListUsers && <ContactContainer chatListUsers={filteredData} />}
    </div>
  );
};

export default ChatList;
