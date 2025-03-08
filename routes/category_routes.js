const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/:category_id', categoryController.updateCategory);
router.delete('/:category_id', categoryController.deleteCategory);
router.get('/export', categoryController.exportExcel);


module.exports = router