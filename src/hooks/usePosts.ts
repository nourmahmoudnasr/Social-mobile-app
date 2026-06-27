import { useEffect, useState, useCallback } from 'react';
import { getPosts, getPost, getComments } from '../api/posts';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';

const usePosts = (postId?: number) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const data: Post[] = await getPosts();
      setPosts(data);
    } catch (e) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchPostDetails = useCallback(async (id: number) => {
    setLoadingPost(true);
    setLoadingComments(true);
    getPost(id)
      .then((data: Post) => setPost(data))
      .catch(console.error)
      .finally(() => setLoadingPost(false));

    getComments(id)
      .then((data: Comment[]) => setComments(data))
      .catch(console.error)
      .finally(() => setLoadingComments(false));
  }, []);

  useEffect(() => {
    if (postId) {
      fetchPostDetails(postId);
    } else {
      fetchPosts();
    }
  }, [postId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  return { posts, post, comments, loading, refreshing, loadingPost, loadingComments, error, onRefresh };
};

export default usePosts;