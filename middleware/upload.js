import multer from 'multer';

// Multer storage configuration
const storage = multer.memoryStorage(); // Stores files in memory as buffers
const upload = multer({
    storage: storage
});

export default upload;
