// controllers/programController.js

import { db } from '../config/dbConnection.js';

// Create a new program
export const createProgram = (req, res) => {
  const { program_name, description, duration, trainer } = req.body;
  const images = req.files; // Retrieve the array of uploaded files

  // Check if all required fields are present
  if (!program_name || !description || !duration || !trainer || !images) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Store the URLs of uploaded images
  const imageUrls = images.map(image => image.path); // Assuming Multer stores the file paths

  const query = `
    INSERT INTO trainingprograms (program_name, description, duration, trainer, img_url) 
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [program_name, description, duration, trainer, imageUrls.join(',')];

  db.query(query, values, (error, results) => {
    if (error) {
      res.status(500).json({
        success: false,
        // err: error,
        error: 'Internal Server Error'
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Training Program created successfully'
    });
  });
};

// Get program by ID
export const getProgramById = (req, res) => {
  const programId = req.params.id;

  const query = `SELECT * FROM trainingprograms WHERE program_id = ?`;

  db.query(query, [programId], (error, results) => {
    if (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Program not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: results[0],
      msg: 'Fetch successfully'
    });
  });
};

// Get all programs
export const getAllPrograms = (req, res) => {
  const query = `SELECT * FROM trainingprograms`;

  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: results,
      msg: "Fetch All training programs successfully."

    });
  });
};

// Update program by ID
export const updateProgram = (req, res) => {
  const programId = req.params.id;
  const { program_name, description, duration, trainer } = req.body;
  const images = req.files; // Retrieve the array of uploaded files

  // Check if all required fields are present
  if (!program_name || !description || !duration || !trainer || !images) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Store the URLs of uploaded images
  const imageUrls = images.map(image => image.path); // Assuming Multer stores the file paths

  const query = `
    UPDATE trainingprograms 
    SET program_name = ?, description = ?, duration = ?, trainer = ?, img_url = ? 
    WHERE program_id = ?
  `;

  const values = [program_name, description, duration, trainer, imageUrls.join(','), programId];

  db.query(query, values, (error, results) => {
    if (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Training Program updated successfully'
    });
  });
};

// Delete program by ID
export const deleteProgram = (req, res) => {
  const programId = req.params.id;

  const query = `DELETE FROM trainingprograms WHERE program_id = ?`;

  db.query(query, [programId], (error, results) => {
    if (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Training Program deleted successfully'
    });
  });
};
