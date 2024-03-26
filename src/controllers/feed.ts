import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import Post from '../models/post';
import HttpError from '../../utils/htttpError';

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
    const error = new HttpError(
      'Validation Failed! Entered data incorrectly!',
      422
    );
    throw error;
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
    if (err instanceof HttpError) {
      if (!err.httpErrorCode) {
        err.httpErrorCode = 500;
      }
      next(err);
    } else if (err instanceof Error) {
      const httpError = new HttpError(err.message, 500);
      next(httpError);
    } else {
      // Handle cases where err might not be an Error object at all
      const unknownError = new HttpError('An unknown error occurred', 500);
      next(unknownError);
    }
  }
};
