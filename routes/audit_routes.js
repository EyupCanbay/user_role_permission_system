const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit_contoller.js')

router.get('/', auditController.getAllAudits)







module.exports = router