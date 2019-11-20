const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const placeRouter = require('./routers/place');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(placeRouter);

module.exports = app;