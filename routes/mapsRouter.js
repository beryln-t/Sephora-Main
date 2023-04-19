const express = require('express');
const router = express.Router();
const mapsController = require('../controllers/mapsController');


router.get('/', mapsController.getLocations);
router.post('/',mapsController.enterLocations)
router.put('/', mapsController.updateLocation)

module.exports = router;