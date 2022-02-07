import { Router } from 'express';
import Forum from '../controllers/forum';

const router = Router();
router.post('/user', Forum.addUser);
router.post('/chat', Forum.addChat);
router.get('/chats', Forum.getForumChats);
router.post('/room/:username/:other', Forum.addRoom);
router.get('/rooms/:username', Forum.getAllRooms);
router.get('/room/:username/:other', Forum.getRoomChats);

export default router;