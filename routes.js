const router = require('express').Router();
//Controllers
const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const tripController = require('./controllers/tripController');
//Use controllers
router.use('/', homeController);
router.use('/auth', authController); 
router.use('/trips', tripController);

module.exports = router;