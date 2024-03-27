import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

import Post from '../models/post';
import User from '../models/user';
import HttpError from '../../utils/htttpError';
import { handleError } from '../../utils/htttpError';

const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, '..', '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

export const getPosts: RequestHandler = async (req, res, next) => {
  const currentPage = parseInt(req.query.page as string, 10) || 1;
  const perPage = 2;

  let totalItems: number;

  try {
    const postCount = await Post.find().countDocuments();
    totalItems = postCount;
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: 'Fetched Posts successfully.', posts, totalItems });
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
      'Validation Failed! Entered data is incorrect!',
      422
    );
    throw error;
  }

  if (!req.file) {
    const error = new HttpError('No Image Provided!', 422);
    throw error;
  }

  const { title, content } = req.body;
  const image: Express.Multer.File = req.file;
  // const imageUrl: string = image.path.split('public')[1];
  const imageUrl = image.path;
  try {
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: req.userId,
    });
    await post.save();
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new HttpError('Could not find user', 404);
      throw error;
    }

    user.posts.push(post._id);
    await user.save();

    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

export const updatePost: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      'Validation Failed! Entered data incorrectly!',
      422
    );
    throw error;
  }

  const postId = req.params.postId;
  const { title, content } = req.body;
  let imageUrl = req.body.image; // If no new file was picked

  // IF USER PICKS a FILE
  if (req.file) {
    const image: Express.Multer.File = req.file;
    // const imageUrl: string = image.path.split('public')[1];
    imageUrl = image.path;
  }

  if (!imageUrl) {
    const err = new HttpError('No file Picked!', 422);
    throw err;
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new HttpError('Could not find post', 404);
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new HttpError('Not Authorised!', 403);
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const updatedPost = await post.save();

    res.status(200).json({ message: 'Post Updated!', post: updatedPost });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  const postId = req.body.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new HttpError('Could not find post', 404);
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new HttpError('Not Authorised!', 403);
      throw error;
    }
    clearImage(post?.imageUrl);
    await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new HttpError('Could not find user', 404);
      throw error;
    }

    (
      user.posts as unknown as mongoose.Types.Array<mongoose.Schema.Types.ObjectId>
    ).pull(postId);
    await user.save();
    res.status(200).json({ message: 'Post deleted!' });
  } catch (err) {
    handleError(err, req, res, next);
  }
};
