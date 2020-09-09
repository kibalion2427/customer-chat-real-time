import axios from "axios";

class ChatHttpService {
  constructor() {
    this.chatAPI = axios.create({
      withCredentials: true,
      baseURL: "http://localhost:8001",
    });
  }
  getMessages(userId, toUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.chatAPI.post("getMessages", {
          userId: userId,
          toUserId: toUserId,
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new ChatHttpService();
