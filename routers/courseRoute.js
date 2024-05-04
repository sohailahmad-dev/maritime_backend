import { Router } from 'express';
import { createCourse } from '../controllers/courseController.js';
import upload from '../middleware/upload.js';

const courseRouter = Router();

courseRouter.post('/course', upload.fields([{ name: 'image', maxCount: 1 }]), createCourse);

export default courseRouter;
