import React, { useState, useEffect } from "react";
import ProductsHttpServer from "../../services/rest/ProductsHttpServer";
import { getAccessToken } from "../../helpers/accessToken";
import { FaAt } from "react-icons/fa";
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [at, setAt] = useState(getAccessToken());

  const fetchPosts = async () => {
    try {
      const response = await ProductsHttpServer.posts();
      if (response) {
        setPosts(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // setAt(getAccessToken());
    // console.log("post token crsf", at);
    // if (at !== "") {
      fetchPosts();
      // setIsLoading(false);
    // } else {
      // setIsLoading(true);
    // }
  }, []);

  // if (loading) return <div>Loading posts...</div>;
  return (
    <div>
      List of Posts
      <div>
        {posts &&
          posts.map((post, index) => {
            return (
              <li key={index}>
                {post.username} - {post.title}
              </li>
            );
          })}
      </div>
    </div>
  );
};

export default Posts;
