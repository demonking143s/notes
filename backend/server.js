import express from 'express';
import cookieParser from 'cookie-parser';
import authRoute from './router/auth.route.js'
import userRoute from './router/user.route.js'
import notesRoute from './router/notes.route.js'
import cors from 'cors';

import connectDB from './db/connectDB.js'; // connect mongoDB


const app = express();

const FRONTEND = process.env.NODE_ENV !== 'production' ? process.env.LOCAL_NEXT : process.env.VERCEL_NEXT;

app.use(cookieParser()); // Move cookie-parser before CORS

app.use(cors({
    origin: [FRONTEND],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

console.log('Frontend URL:', FRONTEND);

app.use(express.json());

connectDB(); // connect mongoDB

const PORT = process.env.PORT;

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/notes', notesRoute)

app.listen(PORT, ()=> {
    console.log(`The port is running on : ${PORT}`)
})