import { validationResult, body, param } from "express-validator";
import bcrypt from 'bcryptjs';
import { db } from "../config/dbConnection.js";
// import { authenticateJwt } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// CREATE USER

export const createUser = async (req, res) => {
    const { userId, username, email, password, role, user_age, user_gender } = req.body;

    try {
        // Check if email already exists
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return res.status(409).send({ success: false, msg: 'This email is already in use!' });
        }

        // Start a database transaction
        await db.beginTransaction();

        // Insert user data into the users table
        const userInsertQuery = 'INSERT INTO users (user_id, username, email, password, role, user_age, user_gender) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const userInsertParams = [userId, username, email, password, role, user_age, user_gender];
        await db.query(userInsertQuery, userInsertParams);

        // Insert username and password into the respective role-specific table
        switch (role) {
            case 'admin':
                await insertAdmin(userId, username, password);
                break;
            case 'student':
                await insertStudent(userId, username, password);
                break;
            case 'employer':
                await insertEmployer(userId, username, password);
                break;
            case 'jobseeker':
                await insertJobseeker(userId, username, password);
                break;
            default:
                // Handle unsupported role
                await db.rollback(); // Rollback the transaction
                return res.status(400).send({ success: false, msg: 'Unsupported role' });
        }

        // Commit the transaction
        await db.commit();

        // Return success response
        return res.status(201).send({ 
            success: true,
            msg: 'User and entity created successfully',
            user: { id: userId, username, email, role }
        });
    } catch (error) {
        // Rollback the transaction if an error occurs
        await db.rollback();

        console.error('Error inserting data:', error);
        return res.status(500).send({ success: false, msg: 'Internal Server Error' });
    }
};

// Function to insert admin data into the admins table
const insertAdmin = async (userId, username, password) => {
    const adminInsertQuery = 'INSERT INTO admins (user_id, username, password) VALUES (?, ?, ?)';
    await db.query(adminInsertQuery, [userId, username, password]);
};

// Function to insert student data into the students table
const insertStudent = async (userId, username, password) => {
    const studentInsertQuery = 'INSERT INTO students (user_id, username, password) VALUES (?, ?, ?)';
    await db.query(studentInsertQuery, [userId, username, password]);
};

// Function to insert employer data into the employers table
const insertEmployer = async (userId, username, password) => {
    const employerInsertQuery = 'INSERT INTO employers (user_id, username, password) VALUES (?, ?, ?)';
    await db.query(employerInsertQuery, [userId, username, password]);
};

// Function to insert jobseeker data into the jobseekers table
const insertJobseeker = async (userId, username, password) => {
    const jobseekerInsertQuery = 'INSERT INTO jobseekers (user_id, username, password) VALUES (?, ?, ?)';
    await db.query(jobseekerInsertQuery, [userId, username, password]);
};



const checkEmailExists = async (email) => {

    try {
        // console.log("........................")

        const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        // console.log("........................")
        return rows.length > 0;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};




// GET USER BY ID

export const getUserById = async (req, res) => {
    // try {
    const authToken = req.headers.authentication.split(' ')[1];
    const decode = jwt.verify(authToken, JWT_SECRET);

    db.query('SELECT * FROM users WHERE user_id = ?', decode.id, function (error, result, fields) {
        if (error) throw error;
        return res.status(200).send({
            success: true,
            data: result[0],
            msg: "Fetch successfully"
        })
    });

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
        // Check if the user exists in the users table
        const userResult = await db.query('SELECT * FROM users WHERE user_id = ?;', [userId]);

        if (!userResult || userResult.length === 0) {
            return res.status(404).send({
                msg: 'User not found!'
            });
        }

        // Start a database transaction
        await db.beginTransaction();

        // Update the user profile in the users table
        const updateUserQuery = `
            UPDATE users
            SET username = ?, email = ?, password = ?, role = ?, user_age = ?, user_gender = ?
            WHERE user_id = ?;
        `;
        await db.query(updateUserQuery, [username, email, password, role, user_age, user_gender, userId]);

        // Update the user profile in the corresponding role table
        switch (role) {
            case 'admin':
                await updateAdmin(userId, username, password);
                break;
            case 'student':
                await updateStudent(userId, username, password);
                break;
            case 'employer':
                await updateEmployer(userId, username, password);
                break;
            case 'jobseeker':
                await updateJobseeker(userId, username, password);
                break;
            // Add cases for other roles...
            default:
                // Handle unsupported role
                break;
        }

        // Commit the transaction
        await db.commit();

        return res.status(200).send({
            success: true,
            msg: "User profile updated successfully!"
        });
    } catch (error) {
        // Rollback the transaction if an error occurs
        await db.rollback();

        return res.status(500).send({
            msg: "Internal Server Error"
        });
    }
};

// Function to update user profile in the admin table
const updateAdmin = async (userId, username, password) => {
    const updateAdminQuery = `
        UPDATE admins
        SET username = ?, password = ?
        WHERE user_id = ?;
    `;
    await db.query(updateAdminQuery, [username, password, userId]);
};

// Function to update user profile in the student table
const updateStudent = async (userId, username, password) => {
    const updateStudentQuery = `
        UPDATE students
        SET username = ?, password = ?
        WHERE user_id = ?;
    `;
    await db.query(updateStudentQuery, [username, password, userId]);
};

// Function to update user profile in the employer table
const updateEmployer = async (userId, username, password) => {
    const updateEmployerQuery = `
        UPDATE employers
        SET username = ?, password = ?
        WHERE user_id = ?;
    `;
    await db.query(updateEmployerQuery, [username, password, userId]);
};

// Function to update user profile in the jobseeker table
const updateJobseeker = async (userId, username, password) => {
    const updateJobseekerQuery = `
        UPDATE jobseekers
        SET username = ?, password = ?
        WHERE user_id = ?;
    `;
    await db.query(updateJobseekerQuery, [username, password, userId]);
};

// DELETE USER
export const deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Check if the user exists
        const userResult = await db.query('SELECT * FROM users WHERE user_id = ?;', [userId]);

        if (!userResult || userResult.length === 0) {
            return res.status(404).send({
                msg: 'User not found!'
            });
        }

        // Start a database transaction
        await db.beginTransaction();

        // Delete the user from the users table
        const deleteUserQuery = 'DELETE FROM users WHERE user_id = ?;';
        await db.query(deleteUserQuery, [userId]);

        // Delete user records from role tables
        const deleteRoleQueries = [
            'DELETE FROM admins WHERE user_id = ?;',
            'DELETE FROM students WHERE user_id = ?;',
            'DELETE FROM employers WHERE user_id = ?;',
            'DELETE FROM jobseekers WHERE user_id = ?;'
            // Add more role tables as needed
        ];

        // Execute delete queries for each role table
        for (const deleteQuery of deleteRoleQueries) {
            await db.query(deleteQuery, [userId]);
        }

        // Commit the transaction
        await db.commit();

        return res.status(200).send({
            success: true,
            msg: "User deleted successfully!"
        });
    } catch (error) {
        // Rollback the transaction if an error occurs
        await db.rollback();

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
                    msg: "User not found"
                });
            }

            // Compare plain text password with stored password
            if (req.body.password === result[0]['password']) {
                // Passwords match, generate JWT token
                const token = jwt.sign({ id: result[0]['user_id'] }, JWT_SECRET, { expiresIn: '1h' });

                return res.status(200).send({
                    msg: "Login successful",
                    token,
                    user: result[0]
                });
            } else {
                // Passwords do not match
                return res.status(111).send({
                    msg: "Email or password is invalid"
                });
            }
        }
    );
};



//LOGOUT

export const logout = async (res, req) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.clearCookie('sessionID'); // Clear session cookie
        res.status(200).json({ message: 'Logout successful' });
    });
};