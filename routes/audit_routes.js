const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit_contoller.js')

router.get('/',checkRole("auditlog_view", "OR"), auditController.getAllAudits)







module.exports = router