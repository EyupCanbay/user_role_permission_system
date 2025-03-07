const ResponseHandler = require('../lib/responseHandler.js');
const CustomError = require('../lib/customError.js');
const emitter = require('../lib/Emitter.js');


emitter.addEmitter('notifications')


async function getEvent(req,res,next) {
    try{
        console.log('getEvent')
        res.writeHead(200,{
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache, no-transform"
        });


        const listener = (data) => {
            console.log(data)
            
        res.write(`data: ${JSON.stringify(data)}\n\n`)
        }
        emitter.getEmitter('notifications').on('messages', listener)

        req.on('close', () => {
            emitter.getEmitter('notifications').off('messages', listener)
        })
    } catch (error) {
        res.status(500).json(ResponseHandler.error('Audit log error', error));
    }
    
}


module.exports = {
    getEvent
}