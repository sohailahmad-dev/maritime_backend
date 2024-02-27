import express from 'express';
import { createUser, getUserById, getAllUsers, updateUser, deleteUser, loginUser, logout } from '../controllers/userController.js';
import { check } from 'express-validator';
import { authenticateJwt } from '../middleware/authMiddleware.js';
import { signUpValidation } from '../helper/validation.js';
import { isAdmin } from '../middleware/isAdmin.js';

const userRouter = express.Router();

userRouter.post('/create_user' , signUpValidation, createUser);

// POST /api/login
userRouter.post('/login' , loginUser);


// Assume this is your login route handler
// userRouter.post('/login' ,isAdmin , loginUser);



// GET /api/user/:userId
userRouter.get('/user/:userId',authenticateJwt, getUserById);

// GET /api/users
userRouter.get('/users',  getAllUsers);

// PUT /api/user/:userId
userRouter.put('/update_user/:userId', authenticateJwt,  updateUser);

// DELETE /api/user/:userId
userRouter.delete('/delete_user/:userId', authenticateJwt,  deleteUser);

userRouter.post('/logout' ,logout);

export default userRouter;
