import {db} from '../config/dbConnection.js';

// Create employer
export const createEmployer = (req, res) => {
    const { employer_id, user_id, company_name, contact_email, contact_number, company_website, company_size, location, description } = req.body;

    const sql = `INSERT INTO employers (employer_id, user_id, company_name, contact_email, contact_number, company_website, company_size, location, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [employer_id, user_id, company_name, contact_email, contact_number, company_website, company_size, location, description];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ 
                success: false,
                error: 'Error inserting data' });
            return;
        }
        console.log('Data inserted successfully');
        res.status(201).json({
            success : true,
            message: 'Employer created successfully'
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

    const sql = `SELECT * FROM employers WHERE employer_id = ?`;
    const values = [employerId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ 
                success: false,
                error: 'Error fetching employer' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ 
                success: false,
                error: 'Employer not found' });
            return;
        }
        const employer = result[0];
        res.json({
            success : true,
            data : employer,
            msg: "Fetch employer data successfully."
        });
    });
};

// Get all employers
export const getAllEmployers = (req, res) => {
    const sql = `SELECT * FROM employers`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ 
                success: false,
                error: 'Error fetching employers' });
            return;
        }
        res.json({
            success : true,
            data : result,
            msg: "Fetch All employers data successfully."
        });
    });
};
