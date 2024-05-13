import { db } from "../config/dbConnection.js";

export const uploadResume = (req, res) => {
    const { jobSeeker_id } = req.body;
    const resume_URL = req.file ? req.file.path : null; // Check if req.file exists and extract path
    const LastUpdatedDate = new Date().toISOString();
  
    // Insert resume details into MySQL database
    const query = 'INSERT INTO resume (jobSeeker_id, resume_URL, LastUpdatedDate) VALUES (?, ?, ?)';
    db.query(query, [jobSeeker_id, resume_URL, LastUpdatedDate], (error, results, fields) => {
      if (error) {
        console.error('Error uploading resume:', error);
        return res.status(500).send('Error uploading resume');
      }
      res.status(200).send('Resume uploaded successfully');
    });
};
