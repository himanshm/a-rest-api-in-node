import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import Post from '../models/post';

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

export const postPosts: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation Failed! Entered data incorrectly!',
      errors: errors.array(),
    });
  }
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imageUrl: 'images/OpenBook.jpg',
      creator: { name: 'Himanshu' },
    });
    const createdPost = await post.save();

    res.status(201).json({
      message: 'Post created successfully!',
      post: createdPost,
    });
  } catch (err) {
    console.log(err);
  }
};
