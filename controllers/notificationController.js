import { db } from "../config/dbConnection.js";

export const createNotification = (req, res) => {
  const { user_id, notificationType, content, IsRead } = req.body;

  const query = 'INSERT INTO notifications (user_id, notificationType, content, IsRead) VALUES (?, ?, ?, ?)';
  db.query(query, [user_id, notificationType, content, IsRead], (err, result) => {
    if (err) {
      console.error('Error creating notification:', err);
      res.status(500).json({ success: false, message: 'Failed to create notification' });
      return;
    }

    res.status(200).json({ 
        success: true, 
        message: 'Notification created successfully'
     });
  });
};


export const getAllNotifications = (req, res) => {
    const query = 'SELECT * FROM notifications';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
        return;
      }
      
      res.status(200).json({ 
        success: true,
        Data: results ,
        msg : "Fetch All notifications data successfully."

      });
    });
  };