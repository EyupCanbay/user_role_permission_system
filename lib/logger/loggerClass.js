const logger = require('./logger')
let instance = null;

class LoggerClass {
    constructor() {
        if(!instance){
            instance = this;
        }
        return instance;
    }
    #maskSensitiveData(log) {
        if (typeof log !== "string") return log;
    
        // Email maskeleme ("example@gmail.com" → "ex*****@gmail.com")
        log = log.replace(/\b([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, (match, user, domain) => {
            return user.slice(0, 2) + "*****@" + domain;
        });
    
        // Telefon numarası maskeleme ( "+90 555 123 4567" → "+90 555 *** ****")
        log = log.replace(/\b(\+?\d{1,3})?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{2,4})\b/g, (match, country, part1, part2, part3) => {
            return `${country ? country + " " : ""}${part1} *** ${part3}`;
        });
    
        // Kimlik numarası maskeleme ("12345678901" → "123****8901")
        log = log.replace(/\b\d{11}\b/g, (match) => {
            return match.substring(0, 3) + "****" + match.substring(7);
        });
    
        // IP adresi maskeleme ("192.168.1.1" → "192.168.*.*")
        log = log.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, (match) => {
            let parts = match.split(".");
            return `${parts[0]}.${parts[1]}.*.*`;
        });
    
        return log;
    }

    #createLogObject(email, location, processType, log){
        log = this.#maskSensitiveData(log)
        return {
             email, location, processType, log
        }
    }

    info(email, location, processType, log){
        let logs = this.#createLogObject(email, location, processType, log);
        logger.info(logs)
    }    
    warn(email, location, processType, log){
        let logs = this.#createLogObject(email, location, processType, log);
        logger.warn(logs)
    }
    error(email, location, processType, log){
        let logs = this.#createLogObject(email, location, processType, log);
        logger.error(logs)
    }
    verbose(email, location, processType, log){
        let logs = this.#createLogObject(email, location, processType, log);
        logger.verbose(logs)
    }
    silly(email, location, processType, log){
        let logs = this.#createLogObject(email, location, processType, log);
        logger.silly(logs)
    }
    http(email, location, processType, log){
        let logs = this.#createLogObject(email, location, processType, log);
        logger.htttp(logs)
    }
    debug(email, location, processType, log){
        let logs = this.#createLogObject(email, location, processType, log);
        logger.debug(logs)
    }
}

module.exports  = new LoggerClass