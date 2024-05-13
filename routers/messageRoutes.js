import express from 'express';
import { getAllMessages, sendAdminMessage } from '../controllers/messageController.js';

const messageRouter = express.Router();

// Route to send a message from admin to a user
messageRouter.post('/send', sendAdminMessage);

messageRouter.get('/messages' , getAllMessages);


export default messageRouter;
