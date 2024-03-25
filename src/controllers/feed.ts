import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: 'Validation Failed! Entered data incorrectly!',
        errors: errors.array(),
      });
  }
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
