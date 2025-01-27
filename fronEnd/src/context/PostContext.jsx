import React, { createContext, useContext, useState, useEffect } from "react";
import { getTimePost } from "../api/auth";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


    const loadPosts = async () => {
      setLoading(true)
      try {
        const fetchedPosts = await getTimePost();
        console.log('posts loadet:', fetchedPosts)

        setPosts(fetchedPosts.data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    loadPosts();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, loading, loadPosts }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);