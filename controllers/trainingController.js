import { db } from '../config/dbConnection.js';

// Create a new program
export const createProgram = (req, res) => {
  const { program_name, description, duration, trainer } = req.body;
  const files = req.files;

  // Validate required fields
  if (!program_name || !description || !duration || !trainer || !files || files.length === 0) {
    return res.status(400).json({ error: 'All fields are required, including at least one image' });
  }

  // Generate URLs for the uploaded files
  const fileUrls = files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

  const query = `
    INSERT INTO trainingprograms (program_name, description, duration, trainer, img_url) 
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [program_name, description, duration, trainer, fileUrls.join(',')];

  db.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
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
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Program not found'
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
      message: 'Fetch successfully'
    });
  });
};

// Get all programs
export const getAllPrograms = (req, res) => {
  const query = `SELECT * FROM trainingprograms`;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }

    res.status(200).json({
      success: true,
      data: results,
      message: "Fetch All training programs successfully."
    });
  });
};

// Update program by ID
export const updateProgram = (req, res) => {
  const programId = req.params.id;
  const { program_name, description, duration, trainer } = req.body;
  const files = req.files;

  // Validate required fields
  if (!program_name || !description || !duration || !trainer || !files) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Generate URLs for the uploaded files
  const fileUrls = files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

  const query = `
    UPDATE trainingprograms 
    SET program_name = ?, description = ?, duration = ?, trainer = ?, img_url = ? 
    WHERE program_id = ?
  `;

  const values = [program_name, description, duration, trainer, fileUrls.join(','), programId];

  db.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
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
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Training Program deleted successfully'
    });
  });
};
