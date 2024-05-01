import express from 'express';
import { createApplication, deleteApplication, getApplicationById, getAllApplications, updateApplication } from '../controllers/applicationController.js';

const applicationRouter = express.Router();

// Create application
applicationRouter.post('/create_application', createApplication);

// Update application
applicationRouter.put('/update_application/:id', updateApplication);

// Delete application
applicationRouter.delete('/delete_application/:id', deleteApplication);

// Get application by ID
applicationRouter.get('/application/:id', getApplicationById);

// Get all applications
applicationRouter.get('/applications', getAllApplications);

export default applicationRouter;
