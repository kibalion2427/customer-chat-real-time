import React, { useState, useEffect,useContext } from "react";
import _uniqBy from "lodash/uniqBy";
import {AdminChatContext} from "../../_context/AdminChatContext"
import ChatSocketService from "../../services/socket/ChatSocketService";
import AuthHttpServer from "../../services/authentication/AuthHttpServer";
import "./chatList.css";

const ChatList = ({ userId, updateSelectedUser }) => {
  const [chatListUsers, setChatListUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser,setSelectedUser] = useContext(AdminChatContext)

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
    setSelectedUser(user)//set global context
  
  };

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

  return (
    <div>
      <h2>Chats</h2>
      <div>
        <input type="text" placeholder="Find a Chat" />
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
