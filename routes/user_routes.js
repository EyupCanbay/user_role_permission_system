const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller.js')
const {checkUser, checkRole} = require('../middleware/auth_middleware.js')


router.get('/', checkUser, checkRole("user_add", "OR"),userController.getAllUsers);
router.post('/', userController.createUser)
router.put('/:user_id', userController.updateUser)
router.delete('/:user_id', userController.deleteUser);
router.post('/register', userController.register)
router.post('/login', userController.login)


module.exports = router