import express from 'express';
import { createJobApplication, deleteJobApplication, getJobApplicationById, getAllJobApplications, updateJobApplication } from '../controllers/jobapplicationController.js';

const jobApplicationRouter = express.Router();

// Create job application
jobApplicationRouter.post('/create_job_application', createJobApplication);

// Update job application
jobApplicationRouter.put('/update_job_application/:id', updateJobApplication);

// Delete job application
jobApplicationRouter.delete('/delete_job_application/:id', deleteJobApplication);

// Get job application by ID
jobApplicationRouter.get('/job_application/:id', getJobApplicationById);

// Get all job applications
jobApplicationRouter.get('/job_applications', getAllJobApplications);

export default jobApplicationRouter;
