const mongoose = require("mongoose");

const schema = mongoose.Schema({
    role_name: {type: String, required: true, unique: true},
    is_active: {type: Boolean, default: true},
    role_privileges: [{ type: mongoose.SchemaTypes.ObjectId, ref: "role_privileges" }],
    created_by: {
        type: mongoose.SchemaTypes.ObjectId
    }
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model("roles", schema);