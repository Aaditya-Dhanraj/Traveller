const express = require('express');
const bookingControllers = require('./../controllers/bookingControllers');
const authControllers = require('./../controllers/authControllers');

// mergeParams is used to get this function access to the routes params from other routes redirected here
const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authControllers.protect,
  bookingControllers.getCheckoutSession
);

module.exports = router;
