import { Router } from 'express';
import { body } from 'express-validator';
import { getPosts, postPosts } from '../controllers/feed';

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

export default router;
