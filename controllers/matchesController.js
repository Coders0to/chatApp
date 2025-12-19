 const Matches = require('../models/scanMatches');
  const User = require('../models/userModel');

  const liked = async (req, res) => {
      try {
          const matches = new Matches({
              user_id: req.session.user._id,
              matches_id: req.body.matches_id,
              type: 'like',

          });
          const savedMatch = await matches.save();
          
          return res.status(200).json({
            success: true,
            message: "You liked this profile.",
            data: savedMatch
        });
      } catch (err) {
         if (err.name === 'ValidationError') {
         const errors = Object.values(err.errors).map(e => {
             return e.message.replace(/Path `(\w+)` is required\./, "$1 is required");
         });
         return res.status(400).json({
             success: false,
             errors: errors
         });
     }
      }
  };

 const getRecentMatchesList = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const matchesUsersIds = await Matches
        .find({ user_id: userId })
        .select('matches_id -_id');
        const idsArr = matchesUsersIds.map(item => item.matches_id);
        const matchesUsers = await User.find({ _id: { $in: idsArr } }).select('-checkLiked -__v -latitude -longitude -password');
        return res.status(200).json({
        success: true,
        message: "Recent matches users list fetched.",
        data: matchesUsers
        });
    } catch (err) {
        console.error("Error fetching matches:", err);
        return res.status(500).json({
        success: false,
        message: "Something went wrong.",
        error: err.message
        });
    }
};

const resetAllMatches = async (req, res) => {
    try {
        const userId = req.session.user._id;
        await Matches.deleteMany({ user_id: userId });
        return res.status(200).json({
        success: true,
        message: "Your matches record is rewind.",
        statusCode:200
        });
    } catch (err) {
        console.error("Error fetching matches:", err);
        return res.status(500).json({
        success: false,
        message: "Something went wrong.",
        error: err.message
        });
    }
};

const getUserSpecInfo = async (req,res) => {
    const userId = req.body.userId;
    const specUserRecord = User.findById({userId});
    console.log('specUserRecord record',specUserRecord);
}

  
  module.exports = {
    liked,
    getRecentMatchesList,
    resetAllMatches,
    getUserSpecInfo,
  }