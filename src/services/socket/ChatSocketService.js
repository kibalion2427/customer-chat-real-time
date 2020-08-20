import io from "socket.io-client";
import events from "events";

class ChatSocketService {
  socket = null;
  eventEmitter = new events.EventEmitter();

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
      this.eventEmitter.emit("logout-response", data);
    });
  }
}

export default new ChatSocketService();
