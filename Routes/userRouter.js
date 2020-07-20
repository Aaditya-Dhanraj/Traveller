const express = require('express');
const userControllers = require('./../controllers/userControllers');
const authControllers = require('./../controllers/authControllers');

const router = express.Router();

router.route('/signup').post(authControllers.signup);
router.route('/login').post(authControllers.login);
router.route('/forgotPassword').post(authControllers.forgotPassword);
router.route('/resetPassword/:token').post(authControllers.resetPassword);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
