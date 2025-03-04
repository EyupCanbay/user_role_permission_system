const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const Category = require("../models/Categories.js")

async function getAllCategories(req,res,next){
    try{    
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

        res.status(201).json(ResponseHandler.success('Category created successfully', category)); 
    } catch (error) {
        res.status(500).json(ResponseHandler.error('An error occurred', error));
    }
}

async function updateCategory(req,res,next){
    const category_id = req.params.category_id;

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

        res.status(200).json(ResponseHandler.success('Category updated successfully', category)); 
    } catch (error) {
        next(error)
    }

}

async function deleteCategory(req,res,next){

    try{
        await Category.findByIdAndDelete({_id: req.params.category_id});
        res.status(200).json(ResponseHandler.success('Category deleted successfully'));
    } catch (error) {
        res.status(500).json(ResponseHandler.error('An error occurred', error));
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}