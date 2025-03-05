const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const AuditLogs = require('../models/AuditLogs.js');
const moment = require('moment');

async function getAllAudits(req,res,next) {
    try {
        let query = {}
        if(req.body.begin_date && req.body.end_date) {
            query.created_at = {
                $gte: moment(req.body.begin_date).toDate(),
                $lte: moment(req.body.end_date).toDate()
            }
        } else {
            query.created_at = {
                $gte: moment().subtract(1, "day").toDate(), 
                $lte: moment().toDate()
            }
        }

        let auditLogs = await AuditLogs.find(query)
        .limit(500)
        .skip(req.body.skip || 0) 
        .sort({ created_at: -1 });
    


        res.status(200).json(ResponseHandler.success('Audit logs successsfuly fetch', auditLogs));
    } catch (error) {
        res.status(500).json(ResponseHandler.error('Audit log error', error));
    }
    
}


module.exports = {
    getAllAudits
}