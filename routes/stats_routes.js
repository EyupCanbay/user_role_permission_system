const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats_controller.js')

router.get('/categories', statsController.getStats)
router.get('/unique', statsController.getStatsUnique)
router.get('/users', statsController.getUsersCount)







module.exports = router