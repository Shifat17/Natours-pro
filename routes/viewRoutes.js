const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const viewController = require('../controllers/viewController');

router.get(
  '/',
  bookingController.createBookingCheckOut,
  authController.isLoggedIn,
  viewController.getOverView
);
router.get(
  '/tour/:slug',
  authController.isLoggedIn,
  viewController.getTourPage
);
router.get('/login', authController.isLoggedIn, viewController.getLogInForm);
router.get('/me', authController.protect, viewController.getAccount);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);
router.get('/my-tours', authController.protect, viewController.getMyTours);
module.exports = router;
