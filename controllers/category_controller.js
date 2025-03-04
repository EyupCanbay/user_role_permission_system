const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const Roles = require('../models/Roles.js')

async function getAllCategories(req,res,next){
    try{    
        let categories =await Roles.find();
        
        res.status(200).json(ResponseHandler.success('Categories retrieved successfully', categories));
    } catch (error) {
        res.status(500).json(ResponseHandler.error('An error occurred', error));
    }
} 



module.exports = {
    getAllCategories
}