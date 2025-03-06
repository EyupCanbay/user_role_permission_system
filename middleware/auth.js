const passport = require('passport')
const {ExtractJwt, Strategy} = require('passport-jwt')
const Users = require('../models/Users')
const UserRoles = require('../models/UserRoles')
const RolePrivileges = require('../models/RolePrivileges')
const Roles = require('../models/Roles')
const config = require('../config')

module.exports = function () {
    let strategy = new Strategy({
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (payload, done) => {
        
        try {
            let user = await Users.findOne({ _id: payload.id });

            if(user) {
                let userRoles = await UserRoles.find({ user_id: payload.id});
                let rolePrivileges = await RolePrivileges.find({role_id: {$in: userRoles.map(up => ur.role_id)}})
                done(null, {
                    id: user._id,
                    roles: rolePrivileges,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    exp: parseInt(date.now()/1000) * process.env.EXPRIRE_TIME
                })
            }
            else {
                done(new Error("User not found"), null)
            }
        }catch (error) {
            done(error, null)
        }
    });

    passport.use(strategy)

    return({
        initialize: function(){
            return passport.initialize()
        },
        authenticate: function(){
            return passport.authenticate("jwt", {session: false})
        },

    })
}

