import { db } from '../config/dbConnection.js';

// CREATE COURSE 

export const createCourse = (req, res) => {
  const { course_name, description, duration, instructor } = req.body;
  const images = req.files; // Retrieve the array of uploaded files

  // Check if all required fields are present
  if (!course_name || !description || !duration || !instructor || !images) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Store the URLs of uploaded images
  const imageUrls = images.map(image => image.path); // Assuming Multer stores the file paths

  // Construct an SQL query to insert course details and image URLs into the database
  const query = `
    INSERT INTO courses (course_name, description, duration, instructor, image_url) 
    VALUES (?, ?, ?, ?, ?)
  `;

  // Create an array of values for the query
  const values = [course_name, description, duration, instructor, imageUrls.join(',')]; // Join URLs with a delimiter

  // Execute the query
  db.query(query, values, (error, results) => {
    if (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
      return;
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
  const images = req.files; // Retrieve the array of uploaded files

  // Check if all required fields are present
  if (!course_name || !description || !duration || !instructor || !images) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Store the URLs of uploaded images
  const imageUrls = images.map(image => image.path); // Assuming Multer stores the file paths

  const query = `
    UPDATE courses 
    SET course_name = ?, description = ?, duration = ?, instructor = ?, image_url = ? 
    WHERE course_id = ?
  `;

  const values = [course_name, description, duration, instructor, imageUrls.join(','), courseId];

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
      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
      return;
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
      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Course not found'
      });
      return;
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
      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: results
    });
  });
};

