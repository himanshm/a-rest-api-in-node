import { RequestHandler } from 'express';

export const getPosts: RequestHandler = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post',
        imageUrl: 'images/OpenBook.jpg',
        creator: { name: 'Himanshu' },
        createdAt: new Date(),
      },
    ],
  });
};

export const postPosts: RequestHandler = (req, res, next) => {
  const { title, content } = req.body;
  // Create posts in DB
  res.status(201).json({
    message: 'Post created successfully!',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: 'Himanshu' },
      createdAt: new Date(),
    },
  });
};
