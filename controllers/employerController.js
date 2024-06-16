import {db} from '../config/dbConnection.js';

// Create employer
export const createEmployer = (req, res) => {
    const { user_id, company_name, contact_email, contact_number, company_website, company_size, location, description } = req.body;

    // Query to fetch username, email, and password from users table
    const getUserQuery = 'SELECT username, email, password FROM users WHERE user_id = ?';

    db.query(getUserQuery, [user_id], (err, userResult) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({
                success: false,
                error: 'Error fetching user data'
            });
        }

        if (userResult.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const { username, email, password } = userResult[0];

        // Insert into employers table
        const insertEmployerQuery = `
            INSERT INTO employers 
            (user_id, username, email, password, company_name, contact_email, contact_number, company_website, company_size, location, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            user_id,
            username,
            email,
            password,
            company_name,
            contact_email,
            contact_number,
            company_website,
            company_size,
            location,
            description
        ];

        db.query(insertEmployerQuery, values, (err, result) => {
            if (err) {
                console.error('Error executing SQL:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Error inserting data'
                });
            }

            console.log('Data inserted successfully');
            res.status(201).json({
                success: true,
                message: 'Employer created successfully'
            });
        });
    });
};

// Update employer by ID
export const updateEmployer = (req, res) => {
    const employerId = req.params.id;
    const { user_id, username, email, password, company_name, contact_email, contact_number, company_website, company_size, location, description } = req.body;

    // Update employer table
    const employerUpdateSql = `UPDATE employers SET user_id = ?, username = ?, email = ?, password = ?, company_name = ?, contact_email = ?, contact_number = ?, company_website = ?, company_size = ?, location = ?, description = ? WHERE employer_id = ?`;
    const employerUpdateValues = [user_id, username, email, password, company_name, contact_email, contact_number, company_website, company_size, location, description, employerId];

    // Update user table
    const userUpdateSql = `UPDATE users SET username = ?, email = ?, password = ? WHERE user_id = ?`;
    const userUpdateValues = [username, email, password, user_id];

    db.beginTransaction((err) => {
        if (err) {
            console.error('Error beginning transaction:', err);
            return res.status(500).json({
                success: false,
                error: 'Error updating employer'
            });
        }

        // Update employer table
        db.query(employerUpdateSql, employerUpdateValues, (employerErr) => {
            if (employerErr) {
                db.rollback(() => {
                    console.error('Error updating employer:', employerErr);
                    res.status(500).json({
                        success: false,
                        error: 'Error updating employer'
                    });
                });
                return;
            }

            // Update user table
            db.query(userUpdateSql, userUpdateValues, (userErr) => {
                if (userErr) {
                    db.rollback(() => {
                        console.error('Error updating user:', userErr);
                        res.status(500).json({
                            success: false,
                            error: 'Error updating user'
                        });
                    });
                    return;
                }

                // Commit transaction if both updates are successful
                db.commit((commitErr) => {
                    if (commitErr) {
                        db.rollback(() => {
                            console.error('Error committing transaction:', commitErr);
                            res.status(500).json({
                                success: false,
                                error: 'Error updating employer'
                            });
                        });
                        return;
                    }

                    console.log('Employer updated successfully');
                    res.json({
                        success: true,
                        message: 'Employer updated successfully'
                    });
                });
            });
        });
    });
};

// Delete employer by ID
export const deleteEmployer = (req, res) => {
    const employerId = req.params.id;

    const sql = `DELETE FROM employers WHERE employer_id = ?`;
    const values = [employerId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ 
                success: false,
                error: 'Error deleting employer' });
            return;
        }
        console.log('Employer deleted successfully');
        res.json({ 
            success : true,
            message: 'Employer deleted successfully' });
    });
};


// Get employer by ID
export const getEmployerById = (req, res) => {
    const employerId = req.params.id;

    // Query to fetch employer details including username, email, and password from users table
    const sql = `SELECT e.*, u.username, u.email, u.password 
                 FROM employers e
                 LEFT JOIN users u ON e.user_id = u.user_id
                 WHERE e.employer_id = ?`;

    db.query(sql, [employerId], (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            return res.status(500).json({ success: false, error: 'Error fetching employer' });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Employer not found' });
        }

        const employer = result[0];
        res.json({
            success: true,
            data: employer,
            message: 'Fetch employer data successfully.'
        });
    });
};

// Get all employers
export const getAllEmployers = (req, res) => {
    const sql = `SELECT e.*, u.username, u.email, u.password 
                 FROM employers e
                 LEFT JOIN users u ON e.user_id = u.user_id`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            return res.status(500).json({ success: false, error: 'Error fetching employers' });
        }

        res.json({
            success: true,
            data: result,
            message: 'Fetch all employers data successfully.'
        });
    });
};
