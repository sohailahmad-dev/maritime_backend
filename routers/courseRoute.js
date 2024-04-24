import express from 'express';
import multer from 'multer';
import { createCourse } from '../controllers/courseController.js';

const courseRouter = express.Router();
const upload = multer();

courseRouter.post('/course', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createCourse);

export default courseRouter;
