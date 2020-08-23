import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import AuthHttpServer from "./services/authentication/AuthHttpServer";
import { setAccessToken } from "./helpers/accessToken";

function App() {
  const [loading, setLoading] = useState(true);

  const fetchRefreshToken = async () => {
    const { accessToken } = await AuthHttpServer.refreshToken();
    if (accessToken) {
      setAccessToken(accessToken);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefreshToken();
  }, []);

  // if (loading) return <div>Loading...</div>;

  return <Routes />;
}

export default App;
