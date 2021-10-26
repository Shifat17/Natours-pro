const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRoutes = require('./reviewRoutes');
const router = express.Router();

//Route Handlers
//router.param("id", tourController.checkId);
router.use('/:tourId/reviews', reviewRoutes);
router
  .route('/top-5-cheapest-tour')
  .get(tourController.alias, tourController.getAllTours);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restricTo('admin', 'guide', 'lead-guide'),
    tourController.getMonthlyPlan
  );
router.route('/tour-stats').get(tourController.getTourStats);

router.route('/').get(authController.protect, tourController.getAllTours).post(
  authController.protect,

  authController.restricTo('admin', 'lead-guide'),
  tourController.createTour
);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restricTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restricTo('admin', 'lead-guide'),
    tourController.deleteTour
  );
//to get a tour within a certain distance

router
  .route('/tours-within/:distance/center/:latling/unit/:unit')
  .get(tourController.getToursWithin);
router.route('/distances/:latlong/unit/:unit').get(tourController.getDistances);

module.exports = router;
