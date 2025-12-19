const mongoose = require("mongoose");

const matchesSchema = new  mongoose.Schema({
    user_id:
    {
        type:String,
        required:false
    },
    matches_id:{
        type:String,
        required:false
    },
    type:{
        type:String,
        required:false
    }
});

module.exports = mongoose.model('Matches',matchesSchema);