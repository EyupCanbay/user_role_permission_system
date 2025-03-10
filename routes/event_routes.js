const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.js');
const {checkUser, checkRole} = require('../middleware/auth_middleware.js')

router.get('/', eventController.getEvent)

module.exports = router