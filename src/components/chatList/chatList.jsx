import React, { useState, useEffect, useContext } from "react";
import _uniqBy from "lodash/uniqBy";
import { AdminChatContext } from "../../_context/AdminChatContext";
import ChatSocketService from "../../services/socket/ChatSocketService";
import AuthHttpServer from "../../services/authentication/AuthHttpServer";
import "./chatList.css";
import ChatHttpService from "../../services/chat/ChatHttpService";

const ChatList = ({ userId, updateSelectedUser }) => {
  const [chatListUsers, setChatListUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useContext(AdminChatContext);

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

  const createChatListUsers = async (socketMessagePacket) => {
    try {
      if (!socketMessagePacket.error) {
        const response = await getUserId(socketMessagePacket.fromUserId);
        if (response) {
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
   * Allow update parent function prop to update (selectedUser) and pass it to Conversation component
   * @param {*} user
   */
  const handleSelectedUser = (user) => {
    setSelectedUserId(user.userId);
    // updateSelectedUser(user);
    setSelectedUser(user); //set global context
  };

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
          // console.log("chatlist response", chatListResponse);
          chatListResponse.chatList.map(async (item, index) => {
            const response = await getUserId(item._id);
            if (response) {
              setChatListUsers((chatListUsers) => [
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
      <div>
        <input type="text" placeholder="Find a Customer to Chat" />
      </div>
      <ul className="user-list">
        {chatListUsers &&
          _uniqBy(chatListUsers, "userId").map((user, index) => (
            <li
              className={selectedUserId === user.userId ? "active" : ""}
              key={index}
              onClick={() => handleSelectedUser(user)}
            >
              {user.username}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChatList;
