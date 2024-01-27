import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import { db } from "../config/dbConnection.js";


// CREATE USER

export const createUser = async (req, res) => {
    // ... existing code ...

    const { username, email, password, role, user_age, user_gender } = req.body;

    db.query(
        `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(email)});`,
        (err, result) => {
            if (result && result.length) {
                return res.status(401).send({
                    msg: 'This user is already in use!'
                });
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(400).send({
                            msg: err
                        });
                    } else {
                        db.query(
                            `INSERT INTO users (username, email, password, role, user_age, user_gender) VALUES (${db.escape(username)}, ${db.escape(email)}, ${db.escape(hash)}, ${db.escape(role)}, ${db.escape(user_age)}, ${db.escape(user_gender)});`,
                            (err, result) => {
                                if (err) {
                                    return res.status(400).send({
                                        msg: err
                                    });
                                }
                                return res.status(201).send({
                                    msg: "The user has been registered with us!"
                                });
                            }
                        );
                    }
                });
            }
        }
    );
};

//GET USER BY ID

export const getUserById = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.userId; // Assuming you have userId in your route

    // Fetch user details by userId
    db.query(
        `SELECT * FROM users WHERE user_id = ${db.escape(userId)};`,
        (err, result) => {
            if (err) {
                return res.status(500).send({
                    msg: "Internal Server Error"
                });
            }

            if (!result || result.length === 0) {
                return res.status(404).send({
                    msg: 'User not found!'
                });
            }

            // Return user details
            const user = result[0]; // Assuming there is only one user with the given userId
            return res.status(200).send({
                user,
                msg: "User details retrieved successfully!"
            });
        }
    );
};

//GET ALL USERS

export const getAllUsers = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    db.query('SELECT * FROM users;', (err, result) => {
        if (err) {
            return res.status(500).send({
                msg: 'Internal Server Error'
            });
        }

        return res.status(200).send({
            users: result,
            msg: 'All users retrieved successfully!'
        });
    });
};

// UPDATE USER

export const updateUser = async (req, res) => {
    // ... existing code ...

    const { username, email, password, role, user_age, user_gender } = req.body;
    const userId = req.params.userId;

    // Check if the user with the provided userId exists
    db.query(
        `SELECT * FROM users WHERE user_id = ${db.escape(userId)};`,
        (err, result) => {
            if (err) {
                return res.status(500).send({
                    msg: "Internal Server Error"
                });
            }

            if (!result || result.length === 0) {
                return res.status(404).send({
                    msg: 'User not found!'
                });
            }

            // Hash the password
            bcrypt.hash(password, 10, (hashError, hash) => {
                if (hashError) {
                    return res.status(400).send({
                        msg: hashError
                    });
                }

                // Update user information
                const updateUserQuery = `
                    UPDATE users
                    SET username = ${db.escape(username)},
                        email = ${db.escape(email)},
                        password = ${db.escape(hash)},
                        role = ${db.escape(role)},
                        user_age = ${db.escape(user_age)},
                        user_gender = ${db.escape(user_gender)}
                    WHERE user_id = ${db.escape(userId)};
                `;

                db.query(updateUserQuery, (updateError, updateResult) => {
                    if (updateError) {
                        return res.status(400).send({
                            msg: updateError
                        });
                    }

                    return res.status(200).send({
                        msg: "User profile updated successfully!"
                    });
                });
            });
        }
    );
};


// DELETE USER

export const deleteUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.userId; // Assuming you have userId in your route

    // Check if the user with the provided userId exists
    db.query(
        `SELECT * FROM users WHERE user_id = ${db.escape(userId)};`,
        (err, result) => {
            if (err) {
                return res.status(500).send({
                    msg: "Internal Server Error"
                });
            }

            if (!result || result.length === 0) {
                return res.status(404).send({
                    msg: 'User not found!'
                });
            }

            // Delete user
            const deleteUserQuery = `
                DELETE FROM users WHERE user_id = ${db.escape(userId)};
            `;

            db.query(deleteUserQuery, (deleteError, deleteResult) => {
                if (deleteError) {
                    return res.status(400).send({
                        msg: deleteError
                    });
                }

                return res.status(200).send({
                    msg: "User deleted successfully!"
                });
            });
        }
    );
};


