import express from 'express';
import { createApplication, deleteApplication, getApplicationById, getAllApplications, updateApplication } from '../controllers/applicationController.js';

const applicationRouter = express.Router();

// Route for creating an application for a course
applicationRouter.post('/create_application/course/:course_id/:std_id', createApplication);

// Route for creating an application for a program
applicationRouter.post('/create_application/program/:program_id/:std_id', createApplication);

// Update application for a course
applicationRouter.put('/update_application/course/:id/:std_id', updateApplication);

// Update application for a program
applicationRouter.put('/update_application/program/:id/:std_id', updateApplication);

// Delete application
applicationRouter.delete('/delete_application/:id', deleteApplication);

// Get application by ID
applicationRouter.get('/application/:id', getApplicationById);

// Get all applications
applicationRouter.get('/applications', getAllApplications);

export default applicationRouter;
