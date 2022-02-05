import { Router } from 'express';
import Forum from '../controllers/forum';

const router = Router();
router.post('/user', Forum.addUser);
router.post('/chat', Forum.addChat);
router.get('/chats', Forum.getForumChats);
router.post('/room/:other', Forum.addRoom);
router.get('/rooms', Forum.getAllRooms);
router.get('/room/:other', Forum.getRoomChats);

export default router;