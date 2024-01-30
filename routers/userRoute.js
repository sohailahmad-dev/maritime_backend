import express from 'express';
import { createUser, getUserById, getAllUsers, updateUser, deleteUser, loginUser } from '../controllers/userController.js';
import { check } from 'express-validator';
import { authenticateJwt } from '../middleware/authMiddleware.js';
import { signUpValidation } from '../helper/validation.js';

const userRouter = express.Router();

// POST /api/register
// userRouter.post('/create_user', [
//     check('username', 'Username is required').notEmpty(),
//     check('email', 'Please enter a valid email').isEmail(),
//     check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
//     check('role', 'Role is required').notEmpty(),
//     check('user_age', 'User age is required').notEmpty(),
//     check('user_gender', 'User gender is required').notEmpty(),
// ], createUser);

userRouter.post('/create_user' , signUpValidation, createUser);

// POST /api/login
userRouter.post('/login', loginUser);

// GET /api/user/:userId
userRouter.get('/user/:userId',authenticateJwt, getUserById);

// GET /api/users
userRouter.get('/users',  getAllUsers);

// PUT /api/user/:userId
userRouter.put('/update_user/:userId', authenticateJwt,  updateUser);

// DELETE /api/user/:userId
userRouter.delete('/delete_user/:userId', authenticateJwt,  deleteUser);

export default userRouter;
