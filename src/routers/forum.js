import { Router } from 'express';
import Forum from '../controllers/forum';

const router = Router();
router.post('/user', Forum.addUser);
router.post('/message', Forum.addChat);
router.get('/messages', Forum.getAllChats);
router.post('/room/:other', Forum.addRoom);
// router.get('/rooms', Forum.getAllRooms);
// router.get('/onechat/:otherID', Forum.getRoomChats);

export default router;