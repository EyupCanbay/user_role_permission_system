const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.js');



router.get('/', eventController.getEvent)







module.exports = router