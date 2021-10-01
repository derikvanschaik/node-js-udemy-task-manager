
const express = require('express');
require('./db/mongoose'); // ensures mongoose connects to db 
const User = require('./models/user');
const Task = require('./models/task'); 
const userRouter = require('./routers/user'); 
const taskRouter = require('./routers/task'); 

const app = express(); 

const port = process.env.PORT || 3000; 

// use this for sending json in post request 
app.use(express.json() );

app.use(userRouter); 
app.use(taskRouter); 

app.listen(port, () =>{
    console.log(`server running on port ${port}`); 
});

const jwt = require('jsonwebtoken');
const myFunc = async () =>{
    const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse');
    console.log(token);
    const data = jwt.verify(token, 'thisismynewcourse'); 
}

