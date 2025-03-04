const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const Roles = require("../models/Roles.js")

async function getAllRoles(req,res,next){
    try{
        const roles = await Roles.find()
        
        if(roles.length == 0) throw new CustomError(400,'Bad Request', 'Role name and is_active cannot be empty')

        res.status(200).json(ResponseHandler.success('Roles retrieved successfully', roles));
    } catch (error) {
        res.status(500).json(ResponseHandler.error('An error occurred', error));
    }
}








module.exports = {
    getAllRoles
}