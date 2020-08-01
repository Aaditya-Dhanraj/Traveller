const express = require('express');
const reviewControllers = require('./../controllers/reviewControllers');
const authControllers = require('./../controllers/authControllers');

// mergeParams is used to get this function access to the routes params from other routes redirected here
const router = express.Router({ mergeParams: true });

router.use(authControllers.protect);

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(
    authControllers.restrictTo('user'),
    reviewControllers.setTourUserIds,
    reviewControllers.createReview
  );

router
  .route('/:id')
  .get(reviewControllers.getReview)
  .patch(
    authControllers.restrictTo('user', 'admin'),
    reviewControllers.updateReview
  )
  .delete(
    authControllers.restrictTo('user', 'admin'),
    reviewControllers.deleteReview
  );

module.exports = router;
