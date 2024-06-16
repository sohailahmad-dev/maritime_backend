import { db } from "../config/dbConnection.js";

//CREATE ADMIN
export const createAdmin = (req, res) => {
    const { admin_id, user_id, first_name, last_name, contact_number, email, role_description } = req.body;

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

        const insertAdminQuery = `
            INSERT INTO admins (admin_id, user_id, username, first_name, last_name, contact_number, email, role_description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const adminValues = [admin_id, user_id, username, first_name, last_name, contact_number, email, role_description];

        const updateUserQuery = `UPDATE users SET username = ?, email = ?, password = ? WHERE user_id = ?`;
        const userValues = [username, email, password, user_id];

        db.beginTransaction((err) => {
            if (err) {
                console.error('Error beginning transaction:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Error creating admin'
                });
            }

            db.query(insertAdminQuery, adminValues, (insertErr, result) => {
                if (insertErr) {
                    db.rollback(() => {
                        console.error('Error inserting admin:', insertErr);
                        res.status(500).json({
                            success: false,
                            error: 'Error inserting admin'
                        });
                    });
                    return;
                }

                db.query(updateUserQuery, userValues, (updateErr) => {
                    if (updateErr) {
                        db.rollback(() => {
                            console.error('Error updating user:', updateErr);
                            res.status(500).json({
                                success: false,
                                error: 'Error updating user'
                            });
                        });
                        return;
                    }

                    db.commit((commitErr) => {
                        if (commitErr) {
                            db.rollback(() => {
                                console.error('Error committing transaction:', commitErr);
                                res.status(500).json({
                                    success: false,
                                    error: 'Error creating admin'
                                });
                            });
                            return;
                        }

                        console.log('Admin created successfully');
                        res.status(201).json({
                            success: true,
                            message: 'Admin created successfully'
                        });
                    });
                });
            });
        });
    });
};


// Update admin by ID
export const updateAdmin = (req, res) => {
    const adminId = req.params.id;
    const { user_id, username, password, first_name, last_name, contact_number, email, role_description } = req.body;

    const getAdminQuery = `SELECT u.username, u.email, u.password FROM admins a LEFT JOIN users u ON a.user_id = u.user_id WHERE a.admin_id = ?`;
    db.query(getAdminQuery, [adminId], (err, adminResult) => {
        if (err) {
            console.error('Error fetching admin data:', err);
            return res.status(500).json({
                success: false,
                error: 'Error fetching admin data'
            });
        }

        if (adminResult.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Admin not found'
            });
        }

        const { username: existingUsername, email: existingEmail, password: existingPassword } = adminResult[0];

        const updateAdminQuery = `
            UPDATE admins SET 
            user_id = ?, username = ?, password = ?, first_name = ?, last_name = ?, contact_number = ?, email = ?, role_description = ? 
            WHERE admin_id = ?
        `;
        const adminUpdateValues = [user_id, username, password, first_name, last_name, contact_number, email, role_description, adminId];

        const updateUserQuery = `UPDATE users SET username = ?, email = ?, password = ? WHERE user_id = ?`;
        const userUpdateValues = [username, email, password, user_id];

        db.beginTransaction((err) => {
            if (err) {
                console.error('Error beginning transaction:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Error updating admin'
                });
            }

            db.query(updateAdminQuery, adminUpdateValues, (updateErr) => {
                if (updateErr) {
                    db.rollback(() => {
                        console.error('Error updating admin:', updateErr);
                        res.status(500).json({
                            success: false,
                            error: 'Error updating admin'
                        });
                    });
                    return;
                }

                db.query(updateUserQuery, userUpdateValues, (userUpdateErr) => {
                    if (userUpdateErr) {
                        db.rollback(() => {
                            console.error('Error updating user:', userUpdateErr);
                            res.status(500).json({
                                success: false,
                                error: 'Error updating user'
                            });
                        });
                        return;
                    }

                    db.commit((commitErr) => {
                        if (commitErr) {
                            db.rollback(() => {
                                console.error('Error committing transaction:', commitErr);
                                res.status(500).json({
                                    success: false,
                                    error: 'Error updating admin'
                                });
                            });
                            return;
                        }

                        console.log('Admin updated successfully');
                        res.json({
                            success: true,
                            message: 'Admin updated successfully'
                        });
                    });
                });
            });
        });
    });
};



// Delete admin by ID
export const deleteAdmin = (req, res) => {
    const adminId = req.params.id;

    const sql = `DELETE FROM admins WHERE admin_id = ?`;
    const values = [adminId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({
                success: false,
                error: 'Error deleting admin'
            });
            return;
        }
        console.log('Admin deleted successfully');
        res.json({
            success: true,
            message: 'Admin deleted successfully'
        });
    });
};

// Get admin by ID
export const getAdminById = (req, res) => {
    const adminId = req.params.id;

    const sql = `
        SELECT a.*, u.username, u.email, u.password 
        FROM admins a
        LEFT JOIN users u ON a.user_id = u.user_id
        WHERE a.admin_id = ?
    `;
    const values = [adminId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({
                success: false,
                error: 'Error fetching admin'
            });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ success: false, error: 'Admin not found' });
            return;
        }
        const admin = result[0];
        res.json({
            success: true,
            data: admin,
            msg: "Fetch admin data successfully."
        });
    });
};


// Get all admins
export const getAllAdmins = (req, res) => {
    const sql = `
        SELECT a.*, u.username, u.email, u.password 
        FROM admins a
        LEFT JOIN users u ON a.user_id = u.user_id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({
                success: false,
                error: 'Error fetching admins'
            });
            return;
        }
        res.json({
            success: true,
            data: result,
            msg: "Fetch All admins data successfully."
        });
    });
};
