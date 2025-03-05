const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const Users = require('../models/Users.js')
const bcrypt =require('bcrypt')
const UserRoles = require('../models/UserRoles.js');
const Roles = require('../models/Roles.js');
const Enum = require('../config/Enum.js');

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
//role doğrulamaları yazılıcak
        let roles = await Roles.find({_id: {$in: req.body.roles}})

        for (let i= 0; i < roles.length; i++){
            await UserRoles.create({
                role_id: roles[i]._id,
                user_id: newUser._id
            })
        }
console.log(roles)
        res.status(201).json(ResponseHandler.success("kullanıcı başarıyla oluşturuldu", newUser))
    }catch (err) {
        let errorResponse = ResponseHandler.error("kullanıcı oluşturulamadı",err);
        res.status(500).json(errorResponse)
    }
}

async function updateUser(req,res,next) {
    try{

        // doğrulama fondkiyonlaarı yazılacak şifre kısmında dikkatli ol
        const newUser = await Users.findByIdAndUpdate(
            req.params.user_id,
            {
            email: req.body.email,
            password: req.body.password,
            is_active: req.body.is_active,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number
            },
            { new: true}
        )
        // role güncelleme doğrulamaları yazılıcak
        const existingRoles = await UserRoles.find({ user_id: req.params.user_id });

        const removedRoles =  existingRoles.filter(x => !req.body.roles.includes(x.role_id.toString())) // x.role_id object id olduğu için onu stringe cevirdik
        let newRoles = req.body.roles.filter(x => !existingRoles.map(p=> p.role_id).includes(x))
        if(removedRoles.length > 0) {
            await UserRoles.deleteMany({_id: {$in: removedRoles.map(x => x._id)}}) 
            console.log("db rollei silindi") 
        }

        if(newRoles.length > 0) {
            await Promise.all(newRoles.map(async (perm) => {
                const userRole = new RolePrivileges({
                    role_id: newRoles.role_id,
                    user_id: req.params.user_id,
                });
        
                console.log(userRole)
                await userRole.save()
                }))
            }
        res.status(200).json(ResponseHandler.success("kullanıcı başarıyla güncellendi", newUser))
    }catch (err) {
        let errorResponse = ResponseHandler.error("kullanıcı güncellenemedi", new CustomError(500, " ",err));
        res.status(500).json(ResponseHandler.error(errorResponse))
    }
}

async function deleteUser(req,res,next) {
    try {
        await Users.findByIdAndDelete(req.params.user_id)
        await UserRoles.deleteMany({user_id: req.params.user_id})
        res.status(200).json(ResponseHandler.success("kullanıcı başarıyla silindi"))
    }catch (err) {
        let errorResponse = ResponseHandler.error("kullanıcı silinemedi", err);
        res.status(500).json(ResponseHandler.error(errorResponse))
    }
}

async function register(req,res,next) {
    try {
        const user = await Users.find();
        if(user.length > 0) return res.status(404).json("hata")
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

        let role = await Roles.create({
            role_name: Enum.SUPER_ADMIN,
            is_active: true,
            created_by: newUser._id
        })

        await UserRoles.create({
            role_id: role._id,
            user_id: newUser._id
        })

        res.status(201).json(ResponseHandler.success("kullanıcı başarıyla oluşturuldu", newUser))
    }catch (err) {
        let errorResponse = ResponseHandler.error("kullanıcı oluşturulamadı",err);
        res.status(500).json(ResponseHandler.error(errorResponse))
    }
    
}





module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    register
}