const express = require('express');
const path = require('path');
const fs = require('fs');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const placeRouter = require('./routers/place');

const app = express();

// var publicDirCheck = '../public';

// var uploadDirCheck = '../public/uploads';

// if (!fs.existsSync(publicDirCheck)){
//     fs.mkdirSync(publicDirCheck);
// }

// if (!fs.existsSync(uploadDirCheck)){
//     fs.mkdirSync(uploadDirCheck);
// }


const publicDir = path.join(__dirname, '../public');

app.use(express.static(publicDir));

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(placeRouter);

// app.get('', (req, res) => {
//     return res.send("API is live!");
// });

module.exports = app;