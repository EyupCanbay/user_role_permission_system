const Enum = require("../config/Enum");

const AuditLogs = require('../models/AuditLogs')
let instance = null    
class AuditLog {
    constructor() {
        if (!instance) {
            instance = this;  // Singleton
        }
    }

    info(email, location, processType, log) {
        this.#saveToDb({
            level: Enum.LOG_LEVELS.INFO,
            email, location, processType, log
        });
    }

    http(email, location, processType, log) {
        this.#saveToDb({
            level: Enum.LOG_LEVELS.HTTP,
            email, location, processType, log
        });
    }

    debug(email, location, processType, log) {
        this.#saveToDb({
            level: Enum.LOG_LEVELS.DEBUG,
            email, location, processType, log
        });
    }

    error(email, location, processType, log) {
        this.#saveToDb({
            level: Enum.LOG_LEVELS.ERROR,
            email, location, processType, log
        });
    }

    warn(email, location, processType, log) {
        this.#saveToDb({
            level: Enum.LOG_LEVELS.WARN,
            email, location, processType, log
        });
    }

    #saveToDb({ email, location, processType, log, level }) {     
        AuditLogs.create({
            level,
            email,
            location,
            processType,
            log
        });
    }
}

module.exports = new AuditLog;
