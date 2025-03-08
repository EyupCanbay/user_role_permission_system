const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const Category = require("../models/Categories.js")
const AuditLog = require('../lib/AuditLogs.js')
const logger = require('../lib/logger/loggerClass.js')
const emitter = require('../lib/Emitter.js');
const excelExports = require('../lib/export.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Import = require('../lib/import.js');

let multerStorage = multer.diskStorage({
    destination: function(req, file, next){
    next (null, __dirname+'../tmp')
    },
    filename: function(req, file, next){
        next(null, file.fieldname + '_' + Date.now()+ path.extname(file.originalname))
    }
})
const upload = multer({storage: multerStorage}).single('pb_file')

async function getAllCategories(req,res,next){
    try{    
        console.log("categories")
        let categories =await Category.find();
        res.status(200).json(ResponseHandler.success('Categories retrieved successfully', categories));
    } catch (error) {
        res.status(500).json(ResponseHandler.error('An error occurred', error));
    }
} 



async function createCategory(req,res,next){
    const body = req.body;
    try{
        
        const category = new Category({
            name: body.name,
            is_active: body.is_active,
            created_by: body.user?.id
        })
        await category.save()

        //AuditLog.info(req.user?.email, "Categories", "Create", category)
        //logger.info(req.user?.email, "Categories", "Create", category)
        emitter.getEmitter('notifications').emit('messages', {message: category.name + ' created'})
        res.status(201).json(ResponseHandler.success('Category created successfully', category)); 
    } catch (error) {
        logger.error(req.user?.email, "Categories", "Create", error)
        res.status(500).json(ResponseHandler.error('An error occurred', error));
    }
}

async function updateCategory(req,res,next){

    try{

        const category = await Category.findByIdAndUpdate(
            req.params.category_id,
            {
                name: req.body.name,
                is_active: req.body.is_active,
                created_by: req.body.user?.id
            },
            { new: true}
        )

        AuditLog.info(req.user?.email, "Categories", "Update", {_id: req.body.id, ...category})
        logger.info(req.user?.email, "Categories", "Update", category)

        res.status(200).json(ResponseHandler.success('Category updated successfully', category)); 
    } catch (error) {
        logger.error(req.user?.email, "Categories", "Update", error)
        next(error)
    }

}

async function deleteCategory(req,res,next){

    try{
        await Category.findByIdAndDelete({_id: req.params.category_id});
        
        AuditLog.info(req.user?.email, "Categories", "Delete", {_id: req.body.id})
        logger.info(req.user?.email, "Catgories", "Delete", {_id: req.body.id})

        res.status(200).json(ResponseHandler.success('Category deleted successfully'));
    } catch (error) {
        logger.error(req.user?.id, "Categories", "Delete")
        res.status(500).json(ResponseHandler.error('An error occurred', error));
    }
}

async function exportExcel(req,res,next) {
    try{    
        let categories =await Category.find();
        let excel=new excelExports(
            ["NAME", "IS_ACTIVE", "CREATED_BY", "CREATED_AT"],
            ["name", "is_active", "created_by", "created_at"],
            categories
        )

        let fileName = __dirname+'../tmp/categories_excel_'+Date.now()+'.xlsx';
        fs.writeFileSync(fileName, excel, "UTF-8");
        res.download(fileName)
        fs.unlinkSync(fileName)
        res.status(200).json(ResponseHandler.success('Categories retrieved successfully', categories));
    } catch (error) {
        res.status(500).json(ResponseHandler.error('An error occurred', error));
    }
}


async function importExcel(req,res,next) {
    try{    

        let file = req.file;
        let body = req.body;

        let rows = Import.fromExcel(file.path);

        if(name){
            for(let i=1; i<rows.length; i++){
                let categories = new Category({
                    name: rows[i][0],
                    is_active: rows[i][1],
                    created_by: rows[i][2],
                    created_at: rows[i][3]
                })
                await categories.save()
            }
        }

        res.status(200).json(ResponseHandler.success('Categories retrieved successfully', categories));
    } catch (error) {
        res.status(500).json(ResponseHandler.error('An error occurred', error));
    }
}
module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    exportExcel,
    importExcel
}