const express = require('express');
const path = require('path');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const placeRouter = require('./routers/place');

const app = express();

const publicDir = path.join(__dirname, '../public');

app.use(express.static(publicDir));

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(placeRouter);

module.exports = app;