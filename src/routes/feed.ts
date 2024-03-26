import { Router } from 'express';
import { body } from 'express-validator';
import { getPost, getPosts, postPosts, updatePost } from '../controllers/feed';

const router = Router();

// GET /feed/posts
router.get('/posts', getPosts);

router.post(
  '/posts',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  postPosts
);

router.get('/post/:postId', getPost);

router.put(
  '/post/:postId',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  updatePost
);

export default router;
