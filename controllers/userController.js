import { validationResult, body } from "express-validator";
import bcrypt from 'bcryptjs';
import { db } from "../config/dbConnection.js";
import { authenticateJwt } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// CREATE USER
export const createUser = async (req, res) => {

    const validationRules = [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        // ... add more rules as needed
    ];

    // Apply validation rules
    await Promise.all(validationRules.map(validation => validation.run(req)));

    // Use validationResult middleware
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role, user_age, user_gender } = req.body;

    try {
        const existingUser = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?);', [email]);

        if (existingUser && existingUser.length) {
            return res.status(401).send({
                msg: 'This user is already in use!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            'INSERT INTO users (username, email, password, role, user_age, user_gender) VALUES (?, ?, ?, ?, ?, ?);',
            [username, email, hashedPassword, role, user_age, user_gender]
        );

        return res.status(201).send({
            msg: "The user has been registered with us!"
        });
    } catch (error) {
        return res.status(500).send({
            msg: "Internal Server Error"
        });
    }
};

// GET USER BY ID


export const getUserById = async (req, res) => {
    // try {
    const authToken = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(authToken, JWT_SECRET);

    db.query('SELECT * FROM users WHERE user_id = ?', decode.id, function (error, result, fields) {
        if (error) throw error;
        return res.status(200).send({
            success: true,
            data: result[0],
            msg: "Fetch successfully"
        })
    });


    //     if (!result || result.length === 0) {
    //         return res.status(404).send({
    //             msg: 'User not found!'
    //         });
    //     }
    //     // console.log(result);

    //     const user = result[0];
    //     return res.status(200).send({
    //         user,
    //         msg: "User details retrieved successfully!"
    //     });
    // } catch (error) {
    //     if (error.name === 'JsonWebTokenError') {
    //         return res.status(401).send({
    //             msg: 'Invalid token'
    //         });
    //     } else if (error.name === 'TokenExpiredError') {
    //         return res.status(401).send({
    //             msg: 'Token expired'
    //         });
    //     } else {
    //         return res.status(500).send({
    //             msg: "Internal Server Error"
    //         });
    //     }
    // }
};


// GET ALL USERS


export const getAllUsers = async (req, res) => {
    try {
        db.query('SELECT * FROM users;', function (error, result, fields) {
            if (error) throw error;
            return res.status(200).send({
                success: true,
                data: result,
                msg: "Fetch All users successfully"
            })
        });



        // if (!result || result.length === 0) {
        //     return res.status(404).send({
        //         msg: 'No users found!'
        //     });
        // }

        // // Extracting only the required properties from each user
        // const filteredUsers = result.map(user => {
        //     const { username, email, password, user_age, user_gender, role } = user;
        //     return { username, email, password, user_age, user_gender, role };
        // });

        // return res.status(200).json({
        //     users: filteredUsers,
        //     msg: 'All users retrieved successfully!'
        // });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            msg: 'Internal Server Error'
        });
    }
};




// UPDATE USER
export const updateUser = async (req, res) => {
    const { username, email, password, role, user_age, user_gender } = req.body;
    const userId = req.params.userId;

    try {
        const authToken = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(authToken, JWT_SECRET);

        const userResult = await db.query('SELECT * FROM users WHERE user_id = ?;', [decode.id]);

        if (!userResult || userResult.length === 0) {
            return res.status(404).send({
                msg: 'User not found!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updateUserQuery = `
            UPDATE users
            SET username = ?, email = ?, password = ?, role = ?, user_age = ?, user_gender = ?
            WHERE user_id = ?;
        `;

        await db.query(updateUserQuery, [username, email, hashedPassword, role, user_age, user_gender, userId]);

        return res.status(200).send({
            msg: "User profile updated successfully!"
        });
    } catch (error) {
        return res.status(500).send({
            msg: "Internal Server Error"
        });
    }
};

// DELETE USER
export const deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const userResult = await db.query('SELECT * FROM users WHERE user_id = ?;', [userId]);

        if (!userResult || userResult.length === 0) {
            return res.status(404).send({
                msg: 'User not found!'
            });
        }

        const deleteUserQuery = 'DELETE FROM users WHERE user_id = ?;';
        await db.query(deleteUserQuery, [userId]);

        return res.status(200).send({
            msg: "User deleted successfully!"
        });
    } catch (error) {
        return res.status(500).send({
            msg: "Internal Server Error"
        });
    }
};





// LOGIN USER

// export const loginUser = async (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const email = req.body.email;

//         const userResult = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?);', [email]);

//         // console.log('userResult:', userResult);

//         if (!userResult || userResult.length === 0) {
//             console.log('User Result is empty or undefined.');
//             return res.status(401).send({
//                 msg: 'User not found!',
//             });
//         }

//         const user = userResult[0];

//         if (!user || typeof user.password !== 'string') {
//             console.log('Invalid user data:', user);
//             return res.status(401).send({
//                 msg: 'Invalid user data!',
//             });
//         }

//         const hashedPassword = user.password;

//         // Await the bcrypt.compare function
//         const isMatch = await bcrypt.compare(req.body.password, hashedPassword);

//         if (isMatch) {
//             // Passwords match
//             const token = jwt.sign({ userId: user.user_id }, 'your-secret-key', { expiresIn: '1h' });
//             return res.status(200).send({
//                 token,
//                 msg: 'Login successful!',
//             });
//         } else {
//             // Passwords do not match
//             return res.status(401).send({
//                 msg: 'Invalid password!',
//             });
//         }
//     } catch (error) {
//         console.error('Error in loginUser:', error);
//         return res.status(500).send({
//             msg: 'Internal Server Error',
//         });
//     }
// };

export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // const userResult = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?);', [email]);

    db.query(
        `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
        (err, result) => {
            if (err) {
                return res.status(403).send({
                    msg: err
                });
            }

            if (!result.length) {
                return res.status(405).send({
                    msg: "Incorrect"
                });
            }

            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                    if (bErr) {
                        return res.status(501).send({
                            msg: bErr
                        });
                    }

                    if (bResult) {
                        // console.log(JWT_SECRET);
                        const token = jwt.sign({ id: result[0]['user_id'] }, JWT_SECRET, { expiresIn: '1h' })

                        return res.status(200).send({
                            msg: "login ",
                            token,
                            user: result[0]
                        });

                    }

                    return res.status(111).send({
                        msg: "email or pass invalid"
                    });

                }
            );
        }
    )
}
