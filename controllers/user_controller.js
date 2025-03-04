const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const Users = require('../models/Users.js')
const bcrypt =require('bcrypt')


async function getAllUsers(req,res,next) {
    try {
        const users = await Users.find()
        res.json(ResponseHandler.success("kullanıcılar başarıyla çekildi", users))
    }catch (error) {
        let errorResponse = ResponseHandler.error("kullanıcılar çekilemedi",error);
        res.status(500).json(ResponseHandler.error(errorResponse))
    }
    
}

async function createUser(req,res,next) {
    try {
        // email ve password olmak üzere doğrulama fonskiyonları eklenicek
        let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

        const newUser = await Users.create({
            email: req.body.email,
            password: password,
            is_active: true,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number
        })
            console.log(newUser)
        res.status(201).json(ResponseHandler.success("kullanıcı başarıyla oluşturuldu", newUser))
    }catch (err) {
        let errorResponse = ResponseHandler.error("kullanıcı oluşturulamadı",err);
        res.status(500).json(ResponseHandler.error(errorResponse))
    }
    
}










module.exports = {
    getAllUsers,
    createUser,
    
}