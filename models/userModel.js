const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true
    },
    gender:
    {
        type:String,
        required:true
    },
    latitude:
    {
        type:Number,
        required:false
    },
    longitude:
    {
        type:Number,
        required:false
    },
    location:
    {
        type:String,
        required:false
    },
    age:
    {
        type:Number,
        required:false
    },
    bio:
    {
        type:String,
        required:false
    },
    // group_id:
    // {
    //     type:String,
    //     required:true
    // },
    image:
    {
        type:String,
        required:false
    },
    password:
    {
        type:String,
        required:true
    },
    is_online:
    {
        type:String,
        default:'0',
    }
},
{
    timestamp:true
});

module.exports = mongoose.model('User',userSchema); 