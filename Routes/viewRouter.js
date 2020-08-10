const express = require('express');
const viewsControllers = require('../controllers/viewsControllers');
const authControllers = require('../controllers/authControllers');
const bookingControllers = require('../controllers/bookingControllers');

const router = express.Router();

// router.use(viewsController.alerts);
router.get(
  '/',
  // bookingControllers.createBookingCheckout,
  authControllers.isLoggedIn,
  viewsControllers.getOverview
);
router.get('/tour/:slug', authControllers.isLoggedIn, viewsControllers.getTour);
router.get(
  '/signup',
  authControllers.isLoggedIn,
  viewsControllers.getSignupForm
);
router.get('/login', authControllers.isLoggedIn, viewsControllers.getLoginForm);
router.get('/me', authControllers.protect, viewsControllers.getAccount);
router.get(
  '/my-tours',
  // bookingControllers.createBookingCheckout,
  authControllers.protect,
  viewsControllers.getMyTours
);

router.post(
  '/submit-user-data',
  authControllers.protect,
  viewsControllers.updateUserData
);

module.exports = router;
