const UserRoles = require('../models/UserRoles')
const RolePrivileges = require('../models/RolePrivileges')
const Users = require('../models/Users')
const Roles = require('../models/Roles')
const jwt = require('jsonwebtoken')
const ResponseHandler = require('../lib/responseHandler')
const Enum = require('../config/Enum')

async function checkUser(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json(ResponseHandler.error("Yetkilendirme hatası: Token eksik"));
        }

        const tokenParts = req.headers.authorization.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json(ResponseHandler.error("Yetkilendirme hatası: Geçersiz token formatı"));
        }

        const token = tokenParts[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Users.findById(payload.id);
        if (!user) {
            return res.status(401).json(ResponseHandler.error("Yetkilendirme hatası: Kullanıcı bulunamadı"));
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(ResponseHandler.error("Yetkilendirme hatası", error));
    }
}

module.exports = {
    checkUser
};

