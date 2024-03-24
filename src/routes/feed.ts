import { Router } from 'express';
import { getPosts } from '../controllers/feed';

const router = Router();

// GET /feed/posts
router.get('/posts', getPosts);

export default router;
