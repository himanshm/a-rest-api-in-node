import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import Post from '../models/post';
import HttpError from '../../utils/htttpError';
import { handleError } from '../../utils/htttpError';

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ message: 'Fetched Posts successfully.', posts });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

export const getPost: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new HttpError('Could not find post', 404);
      throw error;
    }

    res.status(200).json({ message: 'Post fetched!', post: post });
  } catch (err) {
    handleError(err, req, res, next);
  }
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
    handleError(err, req, res, next);
  }
};
