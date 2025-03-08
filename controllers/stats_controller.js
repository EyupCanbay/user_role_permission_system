const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const AuditLogs = require('../models/AuditLogs.js');
const Categories = require('../models/Categories.js');
const { trusted } = require('mongoose');
const Users = require('../models/Users.js');
/*
1. audit log tablosunda işlem apan kişilerin hangi işlemi kaç kez yaptığı sayısı
2. kategori tablsundaki tekil veri sayısı
3. sistemde tanımlı kaç kullanıcı var
*/

async function getStats(req,res,next) {
    try {
        filter = {}

        if(typeof req.body.is_active === "booelan")  filter.is_active = req.body.is_active;
        if(typeof req.body.location === "string")  filter.location = req.body.location;

        let result = await AuditLogs.aggregate([
            {$match: filter},    //SQL deki join mantığıdır 
            {$group: {_id: {log: "$log", processType: "$processType"}, count: {$sum: 1}}},           //bir tane alana göre gruplama yapıcaksanız eğer burada süslü parantez koymanıza gerek yoktur
            {$sort: {count: -1}}
        ])

        res.status(200).json(ResponseHandler.success('Stats successsfuly fetch', result));
    } catch (error) {
        res.status(500).json(ResponseHandler.error('stats log error', error));
    }
    
}


async function getStatsUnique(req,res,next) {
    try {

        filter = {}

        if(typeof req.body.is_active === "booelan")  filter.is_active = req.body.is_active;

        let result = await Categories.distinct('name', filter);
        let categoryCount = await Categories.countDocuments();

        res.status(200).json(ResponseHandler.success('Stats successsfuly fetch', {result, categoryCount}));
    } catch (error) {
        res.status(500).json(ResponseHandler.error('stats log error', error));
    }
    
}


async function getUsersCount(req,res,next) {
    try {

        filter = {}

        if(typeof req.body.is_active === "boolean")  filter.is_active = req.body.is_active;
        
        console.log(filter)
        let usersCount = await Users.countDocuments(filter);
        //let users = await Users.find().select('first_name last_name')

        res.status(200).json(ResponseHandler.success('Stats successsfuly fetch', {usersCount}));
    } catch (error) {
        res.status(500).json(ResponseHandler.error('stats log error', error));
    }
    
}
module.exports = {
    getStats,
    getStatsUnique,
    getUsersCount
}