import { db } from '../config/dbConnection.js';
import { uploadImage, uploadVideo } from '../config/cloudinaryUpload.js';

export const createCourse = async (req, res) => {
  const { course_name, description, duration, instructor } = req.body;

  try {
    // Extract image and video buffers from request
    const imageBuffer = req.files['image'][0].buffer;
    const videoBuffer = req.files['video'][0].buffer;

    // Upload image and video to Cloudinary
    const imageUrl = await uploadImage(imageBuffer);
    const videoUrl = await uploadVideo(videoBuffer);

    console.log("object:" , imageUrl)

    // Insert course data into the database
    const sql = 'INSERT INTO courses (course_name, description, image_url, video_url, duration, instructor) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [course_name, description, imageUrl, videoUrl, duration, instructor];

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
