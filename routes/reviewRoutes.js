const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restricTo('user'),
    reviewController.setTourUserId,
    reviewController.creatReview
  );
router
  .route('/updateReview/:id')
  .patch(
    authController.restricTo('user', 'admin'),
    reviewController.updateReview
  );
router
  .route('/:id')
  .get(authController.protect, reviewController.getReview)
  .delete(
    authController.restricTo('user', 'admin'),
    reviewController.deleteReview
  );
module.exports = router;
