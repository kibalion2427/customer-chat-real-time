import axios from "axios";
import { apiUrl } from "../../config";

class ChatHttpService {
  constructor() {
    this.chatAPI = axios.create({
      withCredentials: true,
      baseURL: apiUrl,
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

  getChatList(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.chatAPI.post("getChatList", {
          userId: userId,
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new ChatHttpService();
