import { Router } from "express";
import { signUpValidation } from '../helper/validation.js'
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userController.js";

const userRoute = Router();

userRoute.get('/users', getAllUsers);
userRoute.get('/user/:userId', getUserById);
userRoute.post('/create_user', signUpValidation, createUser);
userRoute.put('/update_user/:userId', updateUser);
userRoute.delete('/delete_user/:userId', deleteUser);


export default userRoute;