const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role_controller');


router.get('/', roleController.getAllRoles);
router.post('/', roleController.createRole);
router.put('/:role_id', roleController.updateRole);
router.delete('/:role_id', roleController.deleteRole);
router.get('/rolePrivileges', roleController.getRolePrivileges)
module.exports = router