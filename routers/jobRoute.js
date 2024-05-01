import express from 'express';
import { createJob, deleteJob, getJobById, getAllJobs, updateJob } from '../controllers/jobController.js';

const jobRouter = express.Router();

// Create job
jobRouter.post('/create_job', createJob);

// Update job
jobRouter.put('/update_job/:id', updateJob);

// Delete job
jobRouter.delete('/delete_job/:id', deleteJob);

// Get job by ID
jobRouter.get('/job/:id', getJobById);

// Get all jobs
jobRouter.get('/jobs', getAllJobs);

export default jobRouter;
