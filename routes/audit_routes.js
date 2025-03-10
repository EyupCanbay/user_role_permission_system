const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit_contoller.js')
const {checkUser, checkRole} = require('../middleware/auth_middleware.js')

router.get('/',checkRole("auditlog_view", "OR"), auditController.getAllAudits)

module.exports = router