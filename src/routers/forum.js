import { Router } from 'express';
import Forum from '../controllers/forum';

const router = Router();
router.post('/user', Forum.addUser);
router.post('/message', Forum.addChat);
router.get('/messages', Forum.getAllChats);

export default router;