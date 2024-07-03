import express, { application } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import  './config/dbConnection.js';
import dotenv from 'dotenv';
import userRoute from './routers/userRoute.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import courseRouter from './routers/courseRoute.js';
import adminRouter from './routers/adminRoute.js';
import jobSeekerRouter from './routers/jobseekerRoute.js';
import employerRouter from './routers/employerRoutes.js';
import studentRouter from './routers/studentRoute.js';
import jobRouter from './routers/jobRoute.js';
import applicationRouter from './routers/applicationRoutes.js';
import trainingRouter from './routers/trainingRoute.js'
import messageRouter from './routers/messageRoutes.js';
import notificationRouter from './routers/notificationRoutes.js';
import resumeRoute from './routers/resumeRoutes.js';
import jobApplicationRouter from './routers/jobapplicationRoute.js';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

app.use(
    session({
      secret: 'process.env.JWT_SECRET',
      resave: false,
      saveUninitialized: true,
    })
  );
  
  app.use(cookieParser());



app.use('/api', userRoute , courseRouter, trainingRouter , adminRouter , jobSeekerRouter , employerRouter , studentRouter , jobRouter , applicationRouter, jobApplicationRouter, messageRouter, notificationRouter, resumeRoute);


app.use((err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message:err.message,
    });

});

// app.use(express.static(path.join(__dirname, 'build')));

// app.use(express.static("./maritime_frontend/build"));
// app.get("*" , (req , res) => {
//   res.sendFile(path.resolver(__dirname , "maritime_frontend", "build" , "index.html"))
  
// });

app.listen(8000, ()=> { 
    console.log("Server is ruuning on port 8000.");
})


