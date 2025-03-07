const {EventEmitter} = require('events');
let instance = null
class Emitter{
      constructor(){
        if(!instance){
            this.emitter = []
            instance = this
        }
        return instance
    }

    getEmitter(name){
        return this.emitter[name]
    }

    addEmitter(name){
        this.emitter[name] = new EventEmitter(name)

        return this.emitter[name]
    }


}

module.exports = new Emitter()