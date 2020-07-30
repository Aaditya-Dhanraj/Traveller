const express = require('express');
const reviewControllers = require('./../controllers/reviewControllers');
const authControllers = require('./../controllers/authControllers');

// mergeParams is used to get this function access to the routes params from other routes redirected here
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewControllers.getAllReview)
  .post(
    authControllers.protect,
    authControllers.restrictTo('user'),
    reviewControllers.createReview
  );

module.exports = router;
