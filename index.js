import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import  './config/dbConnection.js';
import dotenv from 'dotenv';
import userRoute from './routers/userRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', userRoute);


app.use((err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message:err.message,
    });

});

app.listen(8001, ()=> { 
    console.log("Server is ruuning on port 8001.");
})


