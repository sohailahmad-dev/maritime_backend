import express from 'express';
import upload from '../middleware/upload.js';
import { uploadResume } from '../controllers/resumeController.js';


const resumeRoute = express.Router();

resumeRoute.post('/upload_resume' , upload , uploadResume);

export default resumeRoute;
