const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role_controller');



router.get('/', roleController.getAllRoles);

module.exports = router