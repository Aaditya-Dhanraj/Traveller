const express = require('express');
const userControllers = require('./../controllers/userControllers');
const authControllers = require('./../controllers/authControllers');

const router = express.Router();

//for these four we do not need to log in
router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.get('/logout', authControllers.logout);

router.post('/forgotPassword', authControllers.forgotPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);

//because middleware run in sequense this will run and protect all routes below it
router.use(authControllers.protect);

router.get('/me', userControllers.getMe, userControllers.getUser);

router.patch('/updateMyPassword', authControllers.updatePassword);

router.patch(
  '/updateMe',
  userControllers.uploadUserPhoto,
  userControllers.resizeUserPhoto,
  userControllers.updateMe
);

router.delete('/deleteMe', userControllers.deleteMe);

//because middleware run in sequense this will run and restrict all routes below it
router.use(authControllers.restrictTo('admin'));

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
