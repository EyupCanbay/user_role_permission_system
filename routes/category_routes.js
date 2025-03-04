const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);



module.exports = router