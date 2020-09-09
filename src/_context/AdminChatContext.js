import React, { useState, createContext } from "react";
export const AdminChatContext = createContext();
export const AdminChatProvider = (props) => {
  const [currentUserId, setCurrentUserId] = useState(null); //string
  const [selectedUser, setSelectedUser] = useState(null); //object
  return (
    <AdminChatContext.Provider value={[selectedUser, setSelectedUser]}>
      {props.children}
    </AdminChatContext.Provider>
  );
};
