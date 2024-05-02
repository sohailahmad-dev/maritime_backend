import { db } from "../config/dbConnection.js";

// Create job seeker
export const createJobSeeker = (req, res) => {
    const { jobSeeker_id, user_id, resumeURL, skills, workExperience, education, certifications, languages } = req.body;

    const sql = `INSERT INTO jobseekers (jobSeeker_id, user_id, resumeURL, skills, workExperience, education, certifications, languages) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [jobSeeker_id, user_id, resumeURL, skills, workExperience, education, certifications, languages];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({
                success: false,
                error: 'Error inserting data'
            });
            return;
        }
        console.log('Data inserted successfully');
        res.status(201).json({
            success: true,
            message: 'Job seeker created successfully'
        });
    });
};

// Update job seeker by ID
export const updateJobSeeker = (req, res) => {
    const jobSeekerId = req.params.id;
    const { user_id,username, email, password, resumeURL, skills, workExperience, education, certifications, languages } = req.body;

    // Update jobseekers table
    const jobSeekerUpdateSql = `UPDATE jobseekers SET user_id = ?, username = ?, email = ?, password = ?, resumeURL = ?, skills = ?, workExperience = ?, education = ?, certifications = ?, languages = ? WHERE jobSeeker_id = ?`;
    const jobSeekerUpdateValues = [user_id,username, email, password, resumeURL, skills, workExperience, education, certifications, languages, jobSeekerId];

    // Update user table
    const userUpdateSql = `UPDATE users SET username = ?, email = ?, password = ? WHERE user_id = ?`;
    const userUpdateValues = [username, email, password, user_id];

    db.beginTransaction((err) => {
        if (err) {
            console.error('Error beginning transaction:', err);
            return res.status(500).json({
                success: false,
                error: 'Error updating job seeker'
            });
        }

        // Update jobseekers table
        db.query(jobSeekerUpdateSql, jobSeekerUpdateValues, (jobSeekerErr) => {
            if (jobSeekerErr) {
                db.rollback(() => {
                    console.error('Error updating job seeker:', jobSeekerErr);
                    res.status(500).json({
                        success: false,
                        error: 'Error updating job seeker'
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
                                error: 'Error updating job seeker'
                            });
                        });
                        return;
                    }

                    console.log('Job seeker updated successfully');
                    res.json({
                        success: true,
                        message: 'Job seeker updated successfully'
                    });
                });
            });
        });
    });
};


// Delete job seeker by ID
export const deleteJobSeeker = (req, res) => {
    const jobSeekerId = req.params.id;

    const sql = `DELETE FROM jobseekers WHERE jobSeeker_id = ?`;
    const values = [jobSeekerId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({
                success: false,
                error: 'Error deleting job seeker'
            });
            return;
        }
        console.log('Job seeker deleted successfully');
        res.json({
            success: true,
            message: 'Job seeker deleted successfully'
        });
    });
};

// Get job seeker by ID
export const getJobSeekerById = (req, res) => {
    const jobSeekerId = req.params.id;

    const sql = `SELECT * FROM jobseekers WHERE jobSeeker_id = ?`;
    const values = [jobSeekerId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({
                success: false,
                error: 'Error fetching job seeker'
            });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Job seeker not found' });
            return;
        }
        const jobSeeker = result[0];
        res.json({
            success: true,
            data: jobSeeker,
            msg: "Fetch job seeker data successfully."
        });
    });
};

// Get all job seekers
export const getAllJobSeekers = (req, res) => {
    const sql = `SELECT * FROM jobseekers`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({
                success: false,
                error: 'Error fetching job seekers'
            });
            return;
        }
        res.json({
            success: true,
            data: result,
            msg: "Fetch All job seekers data successfully."
        });
    });
};
