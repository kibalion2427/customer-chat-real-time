import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import AuthHttpServer from "./services/AuthHttpServer";
import { setAccessToken, getAccessToken } from "./helpers/accessToken";

function App() {
  const [loading, setLoading] = useState(true);

  const fetchRefreshToken = async () => {
    const { accessToken } = await AuthHttpServer.refreshToken();
    if (accessToken) {
      setAccessToken(accessToken);
      // setLoading(false);
    }
    // console.log("fetch JWT 1 ", accessToken);
    // console.log("fetch JWT 2", getAccessToken());
  };

  useEffect(() => {
    fetchRefreshToken();
  }, []);

  // if (loading) return <div>Loading...</div>;

  return <Routes />;
}

export default App;
