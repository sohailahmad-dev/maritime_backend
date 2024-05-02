import {db} from '../config/dbConnection.js';

// Create student
export const createStudent = (req, res) => {
    const { std_id, user_id, studentIDNumber, first_name, last_name, email, contact_no, gender, address } = req.body;

    const sql = `INSERT INTO students (std_id, user_id, studentIDNumber, first_name, last_name, email, contact_no, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [std_id, user_id, studentIDNumber, first_name, last_name, email, contact_no, gender, address];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error inserting data' });
            return;
        }
        console.log('Data inserted successfully');
        res.status(201).json({
            success : true,
            data : result,
            message: 'Student created successfully'
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
        const studentSql = `UPDATE students SET user_id = ?, username = ?, email = ?, password = ?, studentIDNumber = ?, first_name = ?, last_name = ?, contact_no = ?, gender = ?, address = ? WHERE std_id = ?`;
        const studentValues = [user_id, username, email, password, studentIDNumber, first_name, last_name, contact_no, gender, address, studentId];

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

    const sql = `SELECT * FROM students WHERE std_id = ?`;
    const values = [studentId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error fetching student' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        const student = result[0];
        res.json({
            success : true,
            data : student,
            msg: "Fetch student data successfully."
        });
    });
};

// Get all students
export const getAllStudents = (req, res) => {
    const sql = `SELECT * FROM students`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error fetching students' });
            return;
        }
        res.json({
            success : true,
            data : result,
            msg: "Fetch All students data successfully."
        });
    });
};
