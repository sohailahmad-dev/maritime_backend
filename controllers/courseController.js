import { db } from '../config/dbConnection.js';
import { uploadImage } from '../config/cloudinaryUpload.js';

export const createCourse = async (req, res) => {
  const { course_name, description, duration, instructor } = req.body;

  try {
    // Ensure that all required data is present in the request body
    if (!course_name || !description || !duration || !instructor) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Ensure that an image is uploaded
    if (!req.files || !req.files['image'] || !req.files['image'][0]) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    // Extract image buffer from request
    const imageBuffer = req.files['image'][0].buffer;

    // Upload image to Cloudinary
    const imageUrl = await uploadImage(imageBuffer);

    // Insert course data into the database
    const sql = 'INSERT INTO courses (course_name, description, image_url, duration, instructor) VALUES (?, ?, ?, ?, ?)';
    const values = [course_name, description, imageUrl, duration, instructor];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting course into database:', err);
        return res.status(500).json({ success: false, message: 'Error creating course' });
      }

      console.log('Course created successfully');
      res.status(201).json({ success: true, message: 'Course created successfully' });
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ success: false, message: 'Error creating course' });
  }
};
