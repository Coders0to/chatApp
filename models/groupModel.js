const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    userid: {
        type:String,
        required:true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
