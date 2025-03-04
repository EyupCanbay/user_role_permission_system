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

async function createRole(req,res,next) {
    try {
        const newRole = new Roles({
            role_name: req.body.role_name,
            is_active: req.body.is_active,
            created_by: req.user?.id
        })
        await newRole.save()

        res.json(ResponseHandler.success("role oluşturuldu",newRole));
    } catch (error) {
        let errorResponse = ResponseHandler.error("role oluşturulamadı",error);
        res.status(500).json(errorResponse)
    }



}






module.exports = {
    getAllRoles,
    createRole
}