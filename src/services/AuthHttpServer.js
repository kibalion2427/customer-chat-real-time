import * as axios from "axios";

class AuthHttpServer {
  constructor() {
    this.authAPI = axios.create({
      withCredentials: true,
      baseURL: "http://localhost:8001",
    });
    
  }
  

  setLocalStorage(key, value) {
    console.log(localStorage, { key, value });
    return new Promise(async (resolve, reject) => {
      try {
        localStorage.setItem(key, value);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
  login(userCredential) {
    return new Promise(async (resolve, reject) => {
      try {
        // const response = await axios.post(
        //   "http://localhost:8001/login",
        //   userCredential,
        //   {
        //     withCredentials: true,
        //   }
        // );
        const response = await this.authAPI.post("login", userCredential);
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  refreshToken() {
    // const accesToken = getAccessToken();
    // this.authAPI.defaults.headers.common["authorization"] = accesToken
    //   ? `bearer ${accesToken}`
    //   : "";
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.authAPI.post("refresh_token");
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }
  register(userCredential) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.authAPI.post("register", userCredential);
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  checkUsernameAvailability(username) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.authAPI.post("usernameAvailable", {
          username: username,
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new AuthHttpServer();
