import express from 'express';
import { createStudent, deleteStudent, getStudentById, getAllStudents, updateStudent } from '../controllers/studentController.js';

const studentRouter = express.Router();

// Create student
studentRouter.post('/create_student', createStudent);

// Update student
studentRouter.put('/update_student/:id', updateStudent);

// Delete student
studentRouter.delete('/delete_student/:id', deleteStudent);

// Get student by ID
studentRouter.get('/student/:id', getStudentById);

// Get all students
studentRouter.get('/students', getAllStudents);

export default studentRouter;
