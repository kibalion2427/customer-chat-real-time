import React, { useState, useEffect } from "react";
import Posts from "../../components/molecules/Posts";
import ProductsHttpServer from "../../services/ProductsHttpServer";
import withAuth from "../../components/atoms/withAuth";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const response = await ProductsHttpServer.posts();
      if (response) {
        setPosts(response);
        console.log("RESPONSE", response[0]);
        console.log("POSTS", posts);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <div>
      Home
      <button onClick={() => getPosts()}>Get Posts</button>
      <ul>{posts && posts.map((post, i) => <li key={i}>{post.title}</li>)}</ul>
      {/* <Posts /> */}
    </div>
  );
};

export default Home;
