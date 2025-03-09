const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');

router.get('/', checkRole("category_view", "OR"),categoryController.getAllCategories);
router.post('/',checkRole("category_add", "OR"), categoryController.createCategory);
router.put('/:category_id', checkRole("category_update", "OR"),categoryController.updateCategory);
router.delete('/:category_id',checkRole("category_delete", "OR"), categoryController.deleteCategory);
router.get('/export',checkRole("excel_export", "OR"), categoryController.exportExcel);
router.get('/import', checkRole("excel_import", "OR"),categoryController.upload ,categoryController.importExcel);

module.exports = router