import { RequestHandler } from 'express';

export const getPosts: RequestHandler = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'First Post', content: 'This is the first post' }],
  });
};

export const postPosts: RequestHandler = (req, res, next) => {
  const { title, content } = req.body;
  // Create posts in DB
  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: new Date().toISOString(), title, content },
  });
};
