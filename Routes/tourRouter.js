const express = require('express');
const tourControllers = require('./../controllers/tourControllers');
const authControllers = require('./../controllers/authControllers');
const reviewRouter = require('./reviewRouter');
// const reviewControllers = require('./../controllers/reviewControllers');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourControllers.checkId);

// to connect the review and tours but repeted code so commented and above better code
// router.route
//   .post('./:tourId/reviews')
//   .post(
//     authControllers.protect,
//     authControllers.restrictTo('user'),
//     reviewControllers.createReview
//   );

//ALIAS ROUTE
router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/tours-stats').get(tourControllers.getTourStats);

router
  .route('/monthly-plans/:year')
  .get(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlans
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour
  );

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.updateTour
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  );

module.exports = router;
