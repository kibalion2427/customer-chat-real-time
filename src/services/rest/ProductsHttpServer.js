import axios from "axios";
import { getAccessToken, setAccessToken } from "../../helpers/accessToken";
import AuthHttpServer from "../authentication/AuthHttpServer";

const CONFIG_HEADERS = (token)=>{
  return {Authorization: token
  ? `bearer ${token}`
  : "",
  Accept: "application/json",
  "Content-Type": "application/x-www-form-urlencoded",
  }
};

class ProductsHttpServer {
  constructor() {
    this.api = axios.create({
      withCredentials: true,
      baseURL: "http://localhost:8002",
    });
    this.api.interceptors.request.use(
      async (config) => {
        config.headers = CONFIG_HEADERS(getAccessToken())
        return config;
      },
      (error) => {
        // console.log("INTERCEPTOR REQUEST ERROR", error);
        Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        return new Promise((resolve,reject) => {
          try{
            const originalRequest = error.config
            if (error.response && error.response.status === 403 && originalRequest && !originalRequest._retry) {
              originalRequest._retry = true
              const response =  AuthHttpServer.refreshToken()
              .then((res)=>{
                setAccessToken(res.accessToken);
                originalRequest.headers= CONFIG_HEADERS(getAccessToken())
                return axios(originalRequest)
              })
              resolve(response)
            }
          }catch(error){
            reject(error)
          }
            
        })
      },
    )
  }

  posts() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.api.get("posts");
        resolve(response.data);
      } catch (error) {
      }
    });
  }
  news() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.api.get("news");
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}
export default new ProductsHttpServer();
