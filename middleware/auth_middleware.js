const UserRoles = require('../models/UserRoles')
const RolePrivileges = require('../models/RolePrivileges')
const Users = require('../models/Users')
const Roles = require('../models/Roles')
const jwt = require('jsonwebtoken')
const ResponseHandler = require('../lib/responseHandler')
const Enum = require('../config/Enum')
const CustomError = require('../lib/customError')
const privs = require('../config/role_privileges')

async function tokenVerify(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return ResponseHandler.error("Token geçersiz", error)
    }
    
}

async function checkUser(req, res, next) {
    try {
        const token = req.cookies.jwt || "";
        if (!token) return ResponseHandler.error({message:"Token bulunamadı"})
            
            const decodedToken = await tokenVerify(token);
            
            const user = await Users.findById(decodedToken.user_id).select("-password");
            const userRole = await UserRoles.find({user_id: user._id});
            const rolePrivileges = await RolePrivileges.find({role_id: {$in: userRole.map(role => role.role_id)}});
            const priveleges = rolePrivileges.map(rp => privs.privileges.find(p => p.key == rp.permission));
            if (!user) return ResponseHandler.error("Token bulunamadı")
                
        req.user = user;
        req.role = priveleges;
        next();
    } catch (error) {
        return ResponseHandler.error("Token bulunamadı", null)
    }
}
function checkRole(requiredRole, mode) {
    return (req,res,next) => {
        try {
            const userRoles = req.role;
            if (!userRoles || !Array.isArray(userRoles)) return ResponseHandler.error({message: "AUTHORIZATION_ERROR"});
            console.log(userRoles)
        
        const hasRoles = 
            mode === "OR" 
                ? userRoles.some(role => requiredRole.includes(role.key)) 
                : userRoles.every(role => requiredRole.includes(role.key));

            console.log(hasRoles , "dksfkkdfskd")
            if (!hasRoles) return ResponseHandler.error({message: "AUTHORIZATION_ERROR"});

            next();
        }catch (error) {
            return ResponseHandler.error({message: "AUTHORIZATION_ERROR"}, error);
        }
    } 

}
module.exports = {
    checkUser,
    checkRole
};

