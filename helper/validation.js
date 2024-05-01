import { check } from "express-validator";

export const signUpValidation = [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Enter valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    // check('password', 'Password length is minimum 6.').isLength({ min: 6 }),
];
