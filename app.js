const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./Routes/tourRouter');
const userRouter = require('./Routes/userRouter');
const { Error } = require('mongoose');

const app = express();

// 1)Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// If not handled by any other middleware then it dosent exist handler
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Fail',
  //   Message: `Can't find ${req.originalUrl} on this server`,
  // });

  //OR

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'Fail';
  // err.statusCode = 404;

  //OR

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// implementing the global err handler
app.use(globalErrorHandler);

module.exports = app;
