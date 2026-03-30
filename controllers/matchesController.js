 const Matches = require('../models/scanMatches');
 const User = require('../models/userModel');
 const likeModel = require('../models/likeModel');
 const Notification = require('../models/notificationModel');
 const axios = require('axios');
const { name } = require('ejs');

//   const liked = async (req, res) => {
//       try {
//           const matches = new Matches({
//               user_id: req.session.user._id,
//               matches_id: req.body.matches_id,
//               type: 'like',
//           });
//           const savedMatch = await matches.save();
          
//           const result = await userAddNewLike(
//                                 userId,
//                                 likerId,
//                                 req.app.get('io')
//                                 );
//           return res.status(200).json({
//             success: true,
//             message: "You liked this profile.",
//             data: savedMatch
//         });
//       } catch (err) {
//          if (err.name === 'ValidationError') {
//          const errors = Object.values(err.errors).map(e => {
//              return e.message.replace(/Path `(\w+)` is required\./, "$1 is required");
//          });
//          return res.status(400).json({
//              success: false,
//              errors: errors
//          });
//      }
//       }
//   };

    const liked = async (req, res) => {
      try {
        const userId = req.body.matches_id;
        const likerId = req.session.user._id;

        // save match
        const match = await Matches.create({
          user_id: likerId,
          matches_id: userId,
          type: 'like'
        });

        // call like service
        const result = await userAddNewLike(
          userId,
          likerId,
          req.app.get('io')
        );

        return res.status(200).json({
          success: true,
          message:
            result.action === 'like'
              ? 'You liked this profile.'
              : 'Like removed successfully.',
          data: match
        });

      } catch (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }
    };

    const userAddNewLike = async (userId, likerId, io) => {
        // check existing like
        const existingLike = await likeModel.findOne({
            user_id: userId,
            liker_id: likerId
        });

        const likedUser = await User.findById(userId);
        const likerUser = await User.findById(likerId);

        if (!likedUser || !likerUser) {
            throw new Error("User not found");
        }

        // UNLIKE CASE
        if (existingLike) {
            await likeModel.deleteOne({ _id: existingLike._id });
            io.of('/user-namespace').to(userId).emit('likeNotification', {
            type: 'unlike',
            from: likerId,
            message: 'You lost a like!'
            });

            return { action: 'unlike' };
        }

        // LIKE CASE
        const newLike = await likeModel.create({
            user_id: userId,
            liker_id: likerId
        });

        io.of('/user-namespace').to(userId).emit('likeNotification', {
            type: 'like',
            from: likerId,
            message: 'You got a like!'
        });

        await Notification.create({
            user_id: userId,
            sender_id: likerId,
            title: 'New Like',
            message: `${likerUser.name} liked your profile.`,
            type: 'like'
        });

        return { action: 'like', data: newLike };
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
        return res.status(500).json({
        success: false,
        message: "Something went wrong.",
        error: err.message
        });
    }
};
  const getUserSpecInfoData = async (req, res) => {
    try {
      const userId = req.query.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required'
        });
      }

      const userData = await User.findById(userId); 

      if (!userData) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('userData', userData);

      return res.status(200).json({
        success: true,
        data: userData
      });

    } catch (error) {
      console.error('getUserSpecInfoData error:', error);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  const getUsers = async (req, res) => {
    res.render('chatUsers', { currentRoute: 'chatUsers',
                user: req.session.user });
  }

  const datingReply = async (req, res) => {
    try {
      const userMessage = "Hii kesi ho aap ?" ; //req.body.message
      console.log('key record',process.env.OPENAI_API_KEY);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: "You are a sweet, romantic, caring dating partner. Reply in flirty but respectful tone. Use emojis sometimes."
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const reply = response.data.choices[0].message.content;

      // JSON response
      res.json({
        success: true,
        reply: reply
      });

    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({
        success: false,
        error: "AI reply failed"
      });
    }
  };

  const testQuery = async (req,res) => {
      const userId = '694bca124b37120a41a54b2b'; // req.session.user._id;
        //const userRecord = await a User.find({email:'aman@gmail.com'});
        const userRecord = await User.findById(userId).select('name email');
        // await  User.updateOne( {email:'aman@gmail.com'},{ $set:{email:'deva@gmail.com',name:'deva'}});
        await User.create({name:'developer', email:'developer@gmail.com', gender:'male',password:'12345678'});
        console.log('logged in user id',userRecord);
  }
  
  module.exports = {
    liked,
    getRecentMatchesList,
    resetAllMatches,
    getUserSpecInfoData,
    getUsers,
    datingReply,
    testQuery,
  }