const { format, createLogger, transports } = require('winston')
const { LOG_LEVEL} = require('../../config/Enum')


const formats = format.combine(
    format.timestamp({format: "YYYY-MM-DD HH:mm:ss.SSS"}),
    format.simple(),
    format.splat(),
    format.printf(info => `${info.timestamp} ${info.level.toLocaleUpperCase()}: [email: ${ info.message.email}] [location: ${info.message.location}] [processType: ${info.message.processType}] [log: ${info.message.log}]`)
)

const logger = createLogger({
    level: LOG_LEVEL,
    transports: [
        new (transports.Console)({format: formats})
    ]
});

module.exports = logger






