const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const Users = require('../models/Users.js')



async function getAllUsers(req,res,next) {
    try {
        const users = await Users.find()
        res.json(ResponseHandler.success("kullanıcılar başarıyla çekildi", users))
    }catch (error) {
        let errorResponse = ResponseHandler.error("kullanıcılar çekilemedi",error);
        res.status(500).json(ResponseHandler.error(errorResponse))
    }
    
}










module.exports = {
    getAllUsers
}