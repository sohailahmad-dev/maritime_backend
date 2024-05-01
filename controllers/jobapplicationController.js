import db from '../config/dbConnection.js';

// Create job application
export const createJobApplication = (req, res) => {
    const { app_id, jobSeeker_id, job_id, AppDate, Status, ResumeURL } = req.body;

    const sql = `INSERT INTO jobapplications (app_id, jobSeeker_id, job_id, AppDate, Status, ResumeURL) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [app_id, jobSeeker_id, job_id, AppDate, Status, ResumeURL];

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
            message: 'Job application created successfully'
        });
    });
};

// Update job application by ID
export const updateJobApplication = (req, res) => {
    const appId = req.params.id;
    const { jobSeeker_id, job_id, AppDate, Status, ResumeURL } = req.body;

    const sql = `UPDATE jobapplications SET jobSeeker_id = ?, job_id = ?, AppDate = ?, Status = ?, ResumeURL = ? WHERE app_id = ?`;
    const values = [jobSeeker_id, job_id, AppDate, Status, ResumeURL, appId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error updating job application' });
            return;
        }
        console.log('Job application updated successfully');
        res.json({ 
            success : true,
            message: 'Job application updated successfully' });
    });
};

// Delete job application by ID
export const deleteJobApplication = (req, res) => {
    const appId = req.params.id;

    const sql = `DELETE FROM jobapplications WHERE app_id = ?`;
    const values = [appId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error deleting job application' });
            return;
        }
        console.log('Job application deleted successfully');
        res.json({ 
            success : true,
            message: 'Job application deleted successfully' });
    });
};

// Get job application by ID
export const getJobApplicationById = (req, res) => {
    const appId = req.params.id;

    const sql = `SELECT * FROM jobapplications WHERE app_id = ?`;
    const values = [appId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error fetching job application' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Job application not found' });
            return;
        }
        const jobApplication = result[0];
        res.json({
            success : true,
            data : jobApplication,
            msg: "Fetch job application data successfully."
        });
    });
};

// Get all job applications
export const getAllJobApplications = (req, res) => {
    const sql = `SELECT * FROM jobapplications`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error fetching job applications' });
            return;
        }
        res.json({
            success : true,
            data : result,
            msg: "Fetch All job applications data successfully."
        });
    });
};
