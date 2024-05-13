import express from 'express';
import { createNotification, getAllNotifications } from '../controllers/notificationController.js';

const notificationRouter = express.Router();

// Route to create a notification
notificationRouter.post('/sendnotification', createNotification);


notificationRouter.get('/notifications' , getAllNotifications);

export default notificationRouter;
