import {db} from '../config/dbConnection.js';

// Create job
export const createJob = (req, res) => {
    // console.log('Received request body:', req.body); // Log the request body
    const { job_title, job_description, requirements, location, salary, employer_id, PostingDate, ExpiryDate } = req.body;

    if (!job_title || !job_description || !requirements || !location || !salary || !employer_id || !PostingDate || !ExpiryDate) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const sql = `INSERT INTO jobs (job_title, job_description, requirements, location, salary, employer_id, PostingDate, ExpiryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [job_title, job_description, requirements, location, salary, employer_id, PostingDate, ExpiryDate];

    // console.log('Executing SQL:', sql, values);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error inserting data' });
            return;
        }
        console.log('Data inserted successfully');
        res.status(201).json({
            success: true,
            data: result,
            message: 'Job created successfully'
        });
    });
};

// Update job by ID
export const updateJob = (req, res) => {
    const jobId = req.params.id;
    const { job_title, job_description, requirements, location, salary, PostingDate, ExpiryDate } = req.body;

    const sql = `UPDATE jobs SET job_title = ?, job_description = ?, requirements = ?, location = ?, salary = ?, PostingDate = ?, ExpiryDate = ? WHERE job_id = ?`;
    const values = [job_title, job_description, requirements, location, salary, PostingDate, ExpiryDate, jobId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error updating job' });
            return;
        }
        console.log('Job updated successfully');
        res.json({ 
            success : true,
            message: 'Job updated successfully' });
    });
};

// Delete job by ID
export const deleteJob = (req, res) => {
    const jobId = req.params.id;

    const sql = `DELETE FROM jobs WHERE job_id = ?`;
    const values = [jobId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error deleting job' });
            return;
        }
        console.log('Job deleted successfully');
        res.json({ 
            success : true,
            message: 'Job deleted successfully' });
    });
};

// Get job by ID
export const getJobById = (req, res) => {
    const jobId = req.params.id;

    const sql = `SELECT * FROM jobs WHERE job_id = ?`;
    const values = [jobId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error fetching job' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Job not found' });
            return;
        }
        const job = result[0];
        res.json({
            success : true,
            data : job,
            msg: "Fetch job data successfully."
        });
    });
};

// Get all jobs
export const getAllJobs = (req, res) => {
    const sql = `SELECT * FROM jobs`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error fetching jobs' });
            return;
        }
        res.json({
            success : true,
            data : result,
            msg: "Fetch All jobs data successfully."
        });
    });
};
