
import React, { useEffect, useState } from 'react';
import AxiosClient from '../../../config/axios';
import PostCard from '../../../shared/post/PostCard';
import { SkeletonList } from '../../../shared/components/LoadingSpinner';

export default function HomeContainer() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.ID !== deletedPostId));
  };

  const getPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await AxiosClient.get("/posts/get_all_posts", {
        params: { token },
      });

      if (response.status === 200) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (loading) {
    return <SkeletonList count={3} className="space-y-4" />;
  }

  return (
    <div className={`space-y-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No posts available.</p>
      ) : (
        posts.map((post) => <PostCard key={post.ID} post={post} onPostDeleted={handlePostDeleted} />)
      )}
    </div>
  );
}
