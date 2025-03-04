const mongoose = require('mongoose');
let instance = null;

class Database {

    constructor() {
        if(!instance){
            this.mongoConnection = null;
            instance = this;
        }
        return instance;
    }

    async connect() {
        try {
            console.log("Connecting to database");
            const db = await mongoose.connect(process.env.DB_URI,
                {
                    dbName: "ytb",
                }
            );
            this.mongoConnection = db;
            console.log("Database connected");
        } catch (error) {
            console.log(error);
            console.log("Error connecting to database");
        }
    }
}

module.exports = Database;