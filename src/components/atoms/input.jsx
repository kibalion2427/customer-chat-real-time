import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const Input = ({ icon, text, style, type, name }) => {
  const [inputText, setInputText] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    setInputText({ [e.target.name]: e.target.value });
    console.log("change", inputText);
  };
  return (
    <div className={style}>
      <div className="i">{icon}</div>
      <div className="div">
        {/* <h5>{text}</h5> */}
        <input
          type={type}
          className="input"
          placeholder={text}
          name={name}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default Input;
