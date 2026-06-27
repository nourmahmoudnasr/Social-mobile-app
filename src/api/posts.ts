const BASE_URL = 'https://gorest.co.in/public/v2';

export const getPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts?per_page=20`);
  return res.json();
};

export const getPost = async (postId: number) => {
  const res = await fetch(`${BASE_URL}/posts/${postId}`);
  return res.json();
};

export const getComments = async (postId: number) => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  return res.json();
};