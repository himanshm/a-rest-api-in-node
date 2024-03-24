import { Router } from 'express';
import { getPosts, postPosts } from '../controllers/feed';

const router = Router();

// GET /feed/posts
router.get('/posts', getPosts);

router.post('/posts', postPosts);

export default router;
