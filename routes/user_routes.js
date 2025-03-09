const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller.js')
const {checkUser, checkRole} = require('../middleware/auth_middleware.js')
const { limiter } = require('../middleware/rateLimit.js')


router.get('/', checkUser, checkRole("user_view", "OR"),userController.getAllUsers);
router.post('/', checkRole("user_add", "OR"),userController.createUser)
router.put('/:user_id', checkRole("user_update", "OR"),userController.updateUser)
router.delete('/:user_id', checkRole("user_delete", "OR"),userController.deleteUser);
router.post('/register',userController.register)
router.get('/login',limiter, userController.login)


module.exports = router