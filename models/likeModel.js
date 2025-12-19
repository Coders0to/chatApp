const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");
const likeSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    liker_id:{
        type:String,
        required:true,
    }
},
{
    timestamp:true
});

module.exports = mongoose.model('LikeModel',likeSchema); 