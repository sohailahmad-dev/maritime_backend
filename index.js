import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
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


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(
    session({
      secret: 'process.env.JWT_SECRET',
      resave: false,
      saveUninitialized: true,
    })
  );
  
  app.use(cookieParser());



app.use('/api', userRoute , courseRouter , adminRouter , jobSeekerRouter , employerRouter , studentRouter);


app.use((err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message:err.message,
    });

});




app.listen(8000, ()=> { 
    console.log("Server is ruuning on port 8000.");
})


