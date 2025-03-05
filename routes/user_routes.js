const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller.js')

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser)
router.put('/:user_id', userController.updateUser)
router.delete('/:user_id', userController.deleteUser);




module.exports = router