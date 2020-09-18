import axios from "axios";
import { restApiUrl } from "../../config";
import { getAccessToken, setAccessToken } from "../../helpers/accessToken";
import AuthHttpServer from "./AuthHttpServer";

class ProductsHttpServer {
  constructor() {
    this.api = axios.create({
      withCredentials: true,
      baseURL: restApiUrl,
    });
    // this.api.interceptors.request.use(
    //   async (config) => {
    //     console.log("INTERCEPTOR REQUEST", getAccessToken());

    //     config.headers = {
    //       Authorization: `Bearer ${getAccessToken()}`,
    //       Accept: "application/json",
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     };
    //     return config;
    //   },
    //   (error) => {
    //     console.log("INTERCEPTOR REQUE ERROR", error);
    //     Promise.reject(error);
    //   }
    // );

    // this.api.interceptors.response.use(
    //   (response) => {
    //     return response;
    //   },
    //   async function (error) {
    //     const originalRequest = error.config;
    //     console.log("ERROR",error.config)
    //     if (error.response.status === 403 && !originalRequest._retry && getAccessToken()) {
    //       originalRequest._retry = true;
    //       const { accessToken } = await AuthHttpServer.refreshToken();
    //       setAccessToken(accessToken);
    //       axios.defaults.headers.common["Authorization"] =
    //         "Bearer " + getAccessToken();
    //         console.log("original request")
    //       return this.api(originalRequest);
    //     }
    //     return Promise.reject(error);
    //   }
    // );

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return new Promise((resolve) => {
          const originalRequest = error.config;
          console.log("ORIGINAL_REQUEST 1 ", originalRequest);
          if (
            error.response &&
            error.response.status === 403 &&
            error.config &&
            !originalRequest._retry
          ) {
            originalRequest._retry = true;
            const response = AuthHttpServer.refreshToken()
              .then((res) => {
                console.log("res 1", res);
                return res;
              })
              .then((res) => {
                console.log("RES 2", res);
                setAccessToken(res.accessToken);
                console.log("ORIGINAL_REQUEST 2", originalRequest);
                const accesToken = getAccessToken();
                originalRequest.headers["authorization"] = accesToken
                  ? `bearer ${accesToken}`
                  : "";
                return axios(originalRequest);
              });
            console.log("RESPONSE", response);
            resolve(response);
          }

          return Promise.reject(error);
        });
      }
    );

    // this.api.interceptors.response.use(
    //   (response) => {
    //     return response;
    //   },
    //   async function (error) {
    //     const originalRequest = error.config;
    //     console.log("ERROR",error.config)
    //     if (error.response.status === 403 && !originalRequest._retry && getAccessToken()) {
    //       originalRequest._retry = true;
    //       const { accessToken } = await AuthHttpServer.refreshToken();
    //       setAccessToken(accessToken);
    //       axios.defaults.headers.common["Authorization"] =
    //         "Bearer " + getAccessToken();
    //         console.log("original request")
    //       return this.api(originalRequest);
    //     }
    //     return Promise.reject(error);
    //   }
    // );
  }

  posts() {
    const accesToken = getAccessToken();
    this.api.defaults.headers.common["authorization"] = accesToken
      ? `bearer ${accesToken}`
      : "";
    console.log("POST ACCESTOKEN", accesToken);
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.api.get("posts");
        resolve(response.data);
      } catch (error) {
        reject(error);
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
