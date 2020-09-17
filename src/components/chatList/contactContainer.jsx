import React, { useContext, useEffect, useState } from "react";
import _uniqBy from "lodash/uniqBy";
import { AdminChatContext } from "../../_context/AdminChatContext";

import "./Contacts.css"

const ContactContainer = ({ chatListUsers }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useContext(AdminChatContext);

  const handleSelectedUser = (user) => {
    setSelectedUserId(user.userId);
    setSelectedUser(user); //set global context
  };
  return (
    <ul className="user-list">
      {chatListUsers &&
        _uniqBy(chatListUsers, "userId").map((user, index) => (
          <li
            className={selectedUserId === user.userId ? "active" : ""}
            key={index}
            onClick={() => handleSelectedUser(user)}
          >
            {user.username}

            <span className={user.online === "Y" ? "online" : "offline"}></span>
          </li>
        ))}
    </ul>
  );
};

export default ContactContainer;
