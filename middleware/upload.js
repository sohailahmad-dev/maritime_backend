// middleware/upload.js

import multer from 'multer';

// Define storage settings
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // Get the course or program name from the request body
    const name = req.body.course_name || req.body.program_name || 'unknown';
    // Generate a unique filename including the name and a timestamp
    const uniqueFilename = `${name}-${Date.now()}-${Math.floor(Math.random() * 1000000)}.jpg`; // Assuming the file type is jpg
    cb(null, uniqueFilename);
  }
});

// Export the multer configuration
export const upload = multer({ 
  storage: storage, 
  limits: { files: 5 } // Limiting to 5 files
}).array('images', 5); // Accepting an array of files with field name 'images'
