require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const db_connect = require('./db/index');
const blogRoutes = require('./routes/blogs');
const userRoutes = require('./routes/users');
const commentRoutes= require('./routes/comments');

app.use(cors());

db_connect();

app.use(express.json());
app.use((req,res,next)=>{
    console.log(req.path,req.method);
    next();
});

app.use('/api/blogs',blogRoutes);
app.use('/api/users',userRoutes);
app.use('/api/comments',commentRoutes);



app.listen(port,()=>{
    console.log('Listening to port '+port)
});