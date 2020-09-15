import * as io from "socket.io-client";
import Emitter from "../../services/emitter";
// import events from "events";

class ChatSocketService {
  socket = null;
  // eventEmitter = new events.EventEmitter();
  eventEmitter = Emitter;

  // Connect to socket server
  // Assign a socketId to userId in DB
  establishSocketConnection(userId) {
    console.log(`ESTABLISHING SOCKET CONNECTION TO ${userId}`);
    try {
      this.socket = io(`http://localhost:8001`, {
        query: `userId=${userId}`,
      });
    } catch (error) {
      alert("cant connect to socket server");
    }
  }

  //logout

  logout(userId) {
    //send event
    this.socket.emit("logout", userId);
    //listen for events
    this.socket.on("logout-response", (data) => {
      this.socket.disconnect();
      this.eventEmitter.emit("logout-response", data);
    });
  }

  sendMessage(message) {
    this.socket.emit("add-message", message);
  }

  receiveMessage() {
    this.socket.on("add-message-response", (data) => {
      this.eventEmitter.emit("add-message-response", data);
    });
  }
  sendIsTyping({ userId, isTyping }) {
    this.socket.emit("typing", { userId, isTyping });
  }
  receiveIsTyping() {
    this.socket.on("typing-response", (data) => {
      this.eventEmitter.emit("typing-response", data);
    });
  }
}

export default new ChatSocketService();
