import { db } from '../config/dbConnection.js';

// CREATE COURSE
export const createCourse = (req, res) => {
  const { course_name, description, duration, instructor } = req.body;
  const files = req.files;

  // Validate required fields
  if (!course_name || !description || !duration || !instructor || !files || files.length === 0) {
    return res.status(400).json({ error: 'All fields are required, including at least one image' });
  }

  // Generate URLs for the uploaded files
  const fileUrls = files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

  // Construct an SQL query to insert course details and image URLs into the database
  const query = `
    INSERT INTO courses (course_name, description, duration, instructor, image_url) 
    VALUES (?, ?, ?, ?, ?)
  `;

  // Create an array of values for the query
  const values = [course_name, description, duration, instructor, fileUrls.join(',')];

  // Execute the query
  db.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }

    res.status(201).json({
      success: true,
      data: results,
      message: 'Course created successfully'
    });
  });
};

// UPDATE COURSE
export const updateCourse = (req, res) => {
  const courseId = req.params.id;
  const { course_name, description, duration, instructor } = req.body;
  const files = req.files;

  // Validate required fields
  if (!course_name || !description || !duration || !instructor || !files) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Generate URLs for the uploaded files
  const fileUrls = files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

  // Construct an SQL query to update course details and image URLs in the database
  const query = `
    UPDATE courses 
    SET course_name = ?, description = ?, duration = ?, instructor = ?, image_url = ? 
    WHERE course_id = ?
  `;

  // Create an array of values for the query
  const values = [course_name, description, duration, instructor, fileUrls.join(','), courseId];

  // Execute the query
  db.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully'
    });
  });
};

// DELETE COURSE
export const deleteCourse = (req, res) => {
  const courseId = req.params.id;

  const query = `DELETE FROM courses WHERE course_id = ?`;

  db.query(query, [courseId], (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  });
};

// Get course by ID
export const getCourseById = (req, res) => {
  const courseId = req.params.id;

  const query = `SELECT * FROM courses WHERE course_id = ?`;

  db.query(query, [courseId], (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: results[0]
    });
  });
};

// Get all courses
export const getAllCourses = (req, res) => {
  const query = `SELECT * FROM courses`;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    }

    res.status(200).json({
      success: true,
      data: results
    });
  });
};
