const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const Roles = require("../models/Roles.js")
const rolePrivileges = require('../config/role_privileges.js');
const RolePrivileges = require('../models/RolePrivileges.js');
const mongoose = require('mongoose');
const AuditLog =require("../lib/AuditLogs.js")
const logger = require('../lib/logger/loggerClass.js')

async function getAllRoles(req,res){
    try{
        const roles = await Roles.find().populate("role_privileges")
        
        if(roles.length == 0) throw new CustomError(400,'Bad Request', 'Role name and is_active cannot be empty')

        AuditLog.info(req.user?.email, "Role", "Get", roles)
        logger.info(req.user?.email, "Role", "Get", roles)
        res.status(200).json(ResponseHandler.success('Roles retrieved successfully', roles));
    } catch (error) {
        logger.error(req.user?.email, "Role", "Get", error )
        res.status(500).json(ResponseHandler.error('An error occurred', error));
    }
}

async function createRole(req,res) {

    //hata kontrolleri yapılacak permission için ve body için
    try {
        const newRole = new Roles({
            role_name: req.body.role_name,
            is_active: req.body.is_active,
            created_by: req.user?.id
        })
        await newRole.save()

        await Promise.all(req.body.permissions.map(async (perm) => {
            const rolePriv = new RolePrivileges({
                role_id: newRole._id,
                permission: perm,
                created_by: req.user?.id
            });

            await rolePriv.save()
            }))
        AuditLog.info(req.user?.email, "Role", "Create", newRole);
        logger.info(req.user?.email, "Role", "Create", newRole)
        res.json(ResponseHandler.success("role oluşturuldu",newRole));
    } catch (error) {
        logger.error(req.user?.email, "ROle", "Create", error)
        let errorResponse = ResponseHandler.error("role oluşturulamadı",error);
        res.status(500).json(errorResponse)
    }
}

async function updateRole(req,res) {
    try {

        // fonksiyon doğrulamaları yazılıcak
    let userRole = await Roles.findOne({user_id: req.user.id, role_id: req.body._id})
    if (userRole) throw new CustomError(403, 'Forbidden', 'Need permission')
    if(req.body.permissions && Array.isArray(req.body.permissions) && req.body.permissions.length > 0){

        let rolePrivs = await RolePrivileges.find({role_id: req.params.role_id })

        const removedPermissions =  rolePrivs.filter(x => !req.body.permissions.includes(x.permission))
        let newPermissions = req.body.permissions.filter(x => !rolePrivs.map(p=> p.permission).includes(x))

        if(removedPermissions.length > 0) {
            await RolePrivileges.deleteMany({_id: {$in: removedPermissions.map(x => x._id)}}) 
        }

        if(newPermissions.length > 0) {
            console.log("req body",req.body.permissions)
            await Promise.all(newPermissions.map(async (perm) => {
                const rolePriv = new RolePrivileges({
                    role_id: req.params.role_id,
                    permission: perm,
                    created_by: req.user?.id
                });
        
                await rolePriv.save()
                }))
            }
        }
        

        const newRole = await Roles.findByIdAndUpdate(
            req.params.role_id,
            {
                role_name: req.body.role_name,
                is_active: req.body.is_active,
                created_by: req.body.user?.id
            },
            {new: true}
        )

        AuditLog.info(req.user?.email,"Role","Update",newRole)
        logger.info(req.user?.email, "Role", "Update",newRole)
        res.json(ResponseHandler.success("role güncellendi",newRole));
    } catch (error) {
        logger.error(req.user?.email, "Role", "Update",error)
        let errorResponse = ResponseHandler.error("role güncellenemedi",error);
        res.status(500).json(errorResponse)
    }
}

async function deleteRole(req,res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{

         await Promise.all([
            RolePrivileges.deleteMany({role_id: req.params.role_id}, {session}),
            Roles.findByIdAndDelete(req.params.role_id, {session})
         ])
         console.log("rolesilindi", req.params.role_id)
         await session.commitTransaction();

         AuditLog.info(req.user?.email,"Role","Delete")
         logger.info(req.user?.email, "Role", "Delete")
         res.status(200).json(ResponseHandler.success("role silindi"));
     } catch (error) {
         logger.error(req.user?.email, "Role", "Delete",error)
         let errorResponse = ResponseHandler.error("role silindi",error);
         res.status(500).json(errorResponse)
}
}
async function getRolePrivileges(req,res,next) {
    res.json(rolePrivileges) // amaçım client tarafında bütün rolleri tek bir yerden görebilmek
}


module.exports = {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    getRolePrivileges
}















// if(req.body.permissions && Array.isArray(req.body.permissions) && req.body.permissions.length > 0){

//     let rolePrivs = await RolePrivileges.find({role_id: req.params.role_id })
//     console.log("db rollei silindi") 

//     console.log(rolePrivs)
//     let removedPermissions = rolePrivs.filter(x => !req.body.permissions.includes(x.permission))
//     let newPermissions = req.body.permissions.filter(x => !rolePrivs.map(p=> p.permission).includes(x))
//     console.log("db rollei silindi") 
//     console.log(removedPermissions.length)
//     if(removedPermissions.length > 0) {
//         await RolePrivileges.deleteMany({_id: {$in: removedPermissions.map(x => x._id)}}) 
//         console.log("db rollei silindi") 
//     }
//     console.log("db rollei silindi") 
//     console.log(newPermissions.length)

//     if(newPermissions > 0) {
//         await Promise.all(req.body.permissions.map(async (perm) => {
//             const rolePriv = new RolePrivileges({
//                 role_id: req.params.id,
//                 permission: perm,
//                 created_by: req.user?.id
//             });
    
//             await rolePriv.save()
//             }))
//         }
//     }
    