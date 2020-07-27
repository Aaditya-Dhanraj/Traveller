const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const tourRouter = require('./Routes/tourRouter');
const userRouter = require('./Routes/userRouter');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const app = express();

// 1)Global Middlewares

// set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// setting up rate limiter to avoid DDOS and Bruteforce attacks  || limit request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Please try again',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//data sanitization against noSQL query injection
app.use(mongoSanitize());

//data sanitization against xss attack
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// serving static file
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log(req.headers);
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
