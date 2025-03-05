const mongoose = require("mongoose");

const schema = mongoose.Schema({
    level: String,
    email: String,
    location: String,
    processType: String,
    log: mongoose.SchemaTypes.Mixed
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});


module.exports = mongoose.model("audit_logs", schema);