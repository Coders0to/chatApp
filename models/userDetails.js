const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    user_id:{
      type:String,
      required:false,
    },
    bio: {
      type: String,
      required: false
    },
    age:{
      type:String,
      required:false,
    },
    height: {
      type: String,
      required: false
    },
    education: {
      type: String,
      required: false
    },
    profession: {
      type: String,
      required: false
    },
    goal: {
      type: String,
      required: false
    },
    interests: {
      type: [String],
      required: false,
      default: []
    },
    moreImg: {
      type: [String],
      required: false,
      default: []
    },
    
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model('userDetails', userDetailsSchema);
