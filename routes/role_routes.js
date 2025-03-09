const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role_controller');


router.get('/', checkRole("user_add", "OR"),roleController.getAllRoles);
router.post('/', checkRole("user_add", "OR"),roleController.createRole);
router.put('/:role_id',checkRole("user_add", "OR"), roleController.updateRole);
router.delete('/:role_id', checkRole("user_add", "OR"),roleController.deleteRole);
router.get('/rolePrivileges',checkRole("user_add", "OR"), roleController.getRolePrivileges)
module.exports = router