const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRouter');
const userRouter = require('./Routes/userRouter');

const app = express();

// 1)Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();
    next();
  });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) Start Server

const port = 3000;
app.listen(port, () => {
  console.log(` app running on port no ${port}`);
});
