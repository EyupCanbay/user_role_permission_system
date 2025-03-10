const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats_controller.js')
const {checkUser, checkRole} = require('../middleware/auth_middleware.js')


router.get('/categories', checkRole("stats_view", "OR"), statsController.getStats)
router.get('/unique',checkRole("stats_view", "OR"), statsController.getStatsUnique)
router.get('/users',checkRole("stats_view", "OR"), statsController.getUsersCount)







module.exports = router