import { Router } from 'express';
import { body } from 'express-validator';
import {
  deletePost,
  getPost,
  getPosts,
  postPosts,
  updatePost,
} from '../controllers/feed';
import isAuth from '../../middleware/is-auth';

const router = Router();

// GET /feed/posts
router.get('/posts', isAuth, getPosts);

router.post(
  '/posts',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  postPosts
);

router.get('/post/:postId', isAuth, getPost);

router.put(
  '/post/:postId',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  updatePost
);

router.delete('/post/:postId', isAuth, deletePost);

export default router;
