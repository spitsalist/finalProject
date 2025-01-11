import React, { createContext, useContext, useState, useEffect } from "react";
import { getTimePost } from "../api/auth";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await getTimePost();
        setPosts(fetchedPosts?.data?.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, loading }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);