import {db} from '../config/dbConnection.js';

// Create student
export const createStudent = (req, res) => {
    const { std_id, user_id, studentIDNumber, first_name, last_name, email, contact_no, gender, address } = req.body;

    // Query to fetch username, email, and password from users table
    const getUserQuery = 'SELECT username, email, password FROM users WHERE user_id = ?';

    db.query(getUserQuery, [user_id], (err, userResult) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ success: false, error: 'Error inserting data' });
        }

        if (userResult.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const { username, email, password } = userResult[0];

        // Insert into students table
        const sql = `INSERT INTO students (std_id, user_id, studentIDNumber, first_name, last_name, email, contact_no, gender, address, username, password) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [std_id, user_id, studentIDNumber, first_name, last_name, email, contact_no, gender, address, username, password];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error executing SQL:', err);
                return res.status(500).json({ success: false, error: 'Error inserting data' });
            }

            console.log('Data inserted successfully');
            res.status(201).json({
                success: true,
                message: 'Student created successfully'
            });
        });
    });
};


// Update student by ID
export const updateStudent = (req, res) => {
    const studentId = req.params.id;
    const { user_id, username, email, password, studentIDNumber, first_name, last_name, contact_no, gender, address } = req.body;

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error beginning transaction:', err);
            res.status(500).json({ success: false, error: 'Error updating student' });
            return;
        }

        // Update student table
        const studentSql = `UPDATE students SET user_id = ?, studentIDNumber = ?, first_name = ?, last_name = ?, email = ?, contact_no = ?, gender = ?, address = ?, username = ?, password = ? WHERE std_id = ?`;
        const studentValues = [user_id, studentIDNumber, first_name, last_name, email, contact_no, gender, address, username, password, studentId];

        db.query(studentSql, studentValues, (studentErr, studentResult) => {
            if (studentErr) {
                console.error('Error updating student:', studentErr);
                db.rollback(() => {
                    res.status(500).json({ success: false, error: 'Error updating student' });
                });
                return;
            }

            // Update user table
            const userSql = `UPDATE users SET username = ?, email = ?, password = ? WHERE user_id = ?`;
            const userValues = [username, email, password, user_id];

            db.query(userSql, userValues, (userErr, userResult) => {
                if (userErr) {
                    console.error('Error updating user:', userErr);
                    db.rollback(() => {
                        res.status(500).json({ success: false, error: 'Error updating user' });
                    });
                    return;
                }

                // Commit the transaction
                db.commit((commitErr) => {
                    if (commitErr) {
                        console.error('Error committing transaction:', commitErr);
                        db.rollback(() => {
                            res.status(500).json({ success: false, error: 'Error updating student' });
                        });
                        return;
                    }

                    console.log('Student updated successfully');
                    res.json({ success: true, message: 'Student updated successfully' });
                });
            });
        });
    });
};


// Delete student by ID
export const deleteStudent = (req, res) => {
    const studentId = req.params.id;

    const sql = `DELETE FROM students WHERE std_id = ?`;
    const values = [studentId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error deleting student' });
            return;
        }
        console.log('Student deleted successfully');
        res.json({ 
            success : true,
            message: 'Student deleted successfully' });
    });
};

// Get student by ID
export const getStudentById = (req, res) => {
    const studentId = req.params.id;

    // Query to fetch student details including username, email, and password
    const sql = `SELECT s.*, u.username, u.email, u.password 
                 FROM students s
                 LEFT JOIN users u ON s.user_id = u.user_id
                 WHERE s.std_id = ?`;

    db.query(sql, [studentId], (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            return res.status(500).json({ success: false, error: 'Error fetching student' });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        const student = result[0];
        res.json({
            success: true,
            data: student,
            message: 'Fetch student data successfully.'
        });
    });
};

// Get all students
export const getAllStudents = (req, res) => {
    // Query to fetch all students with username, email, and password
    const sql = `SELECT s.*, u.username, u.email, u.password 
                 FROM students s
                 LEFT JOIN users u ON s.user_id = u.user_id`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            return res.status(500).json({ success: false, error: 'Error fetching students' });
        }

        res.json({
            success: true,
            data: result,
            message: 'Fetch all students data successfully.'
        });
    });
};
