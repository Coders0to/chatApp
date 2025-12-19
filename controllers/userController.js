 const User = require('../models/userModel');
 const Chat = require('../models/chatModel');
 const Group = require('../models/groupModel');
 const likeModel = require('../models/likeModel');
 const Response = require('../utils/responseHandler');
 const Notification = require('../models/notificationModel');
 const Matches = require('../models/scanMatches');
 const bcrypt = require('bcrypt');

 const registerLoad = async (req, res) => {
     try {
         const groups = await Group.find();
         res.render('register', {
             groups
         });
     } catch (error) {
         res.status(500).send({
             success: false,
             msg: error.message
         });
     }
 };


 const iframe = async (req, res) => {
     res.render('user1blade');
 }


 const generateUniqueCode = async () => {
     let isUnique = false;
     let uniqueCode;

     while (!isUnique) {
         // Generate a random 8-character alphanumeric code
         uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();

         // Check if this code already exists in the User table
         const existingUser = await User.findOne({
             group_code: uniqueCode
         });

         if (!existingUser) {
             isUnique = true; // If no existing user has this code, break loop
         }
     }

     return uniqueCode;
 };
 const register = async (req, res) => {
     try {

        //  let groupId = req.body.group_id;
        //  let groupCode = null;
        //  if (req.body.group_type == 1) {
        //      const existingGroup = await Group.findOne({
        //          name: req.body.group_name
        //      });
        //      if (!existingGroup) {
        //          return res.status(400).send({
        //              success: false,
        //              msg: "Group not found!"
        //          });
        //      }
        //      groupId = existingGroup._id; // Assign existing group's ID
        //      groupCode = existingGroup.group_code; // Assign existing group's code
        //  } else if (req.body.group_type == 2) {
        //      const uniqueCode = await generateUniqueCode();
        //      const newGroup = new Group({
        //          name: uniqueCode,
        //          userid: 0,
        //      });

        //      const savedGroup = await newGroup.save();
        //      groupId = savedGroup._id;
        //      groupCode = savedGroup.group_code; // Assign newly created group’s code
        //  }
         // group_id: groupId,
         //  ** Create User with assigned group details **
         const passwordHash = await bcrypt.hash(req.body.password, 10);
         let imagePath = '';
            if(req.file && req.file.filename){
                imagePath = 'images/' + req.file.filename;
            } else {
                imagePath = ''; 
            }
         const user = new User({
             name: req.body.name,
             email: req.body.email,
             gender: req.body.gender,
             latitude: req.body.latitude, //27.8973944,
             longitude: req.body.longitude, //78.0880129
             location: req.body.location,
             age: 0,
             bio: '',
             image: imagePath,
             password: passwordHash
         });
         const savedUser = await user.save();
        //  if (req.body.group_type == 2) {
        //      await Group.findByIdAndUpdate(groupId, {
        //          userid: savedUser._id
        //      });
        //  }
         // res.redirect('/register',{message:"User Register Successfully !!"});
         return Response.success(res, "User registered successfully!", {
             statusCode: 200,
             redirect: '/'
         });
         // return Response.success(res, "Login successful", { redirect: '/dashboard' });
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

 const notification = async (req,res) => {
   try{
      const logInUId = req.session.user._id;
      const notifications = await  Notification.find({sender_id:logInUId}).select('_id title message type is_read created_at');
      console.log('notifications record ',notifications);

       // return Response.success(res, "All Notification received successful", {notifications:notifications});

       res.render('notification', {
                                      currentRoute: '/notification',
                                      notifications: notifications
                                 });
   }
   catch (error){

   }
    
 }
 const loadLogin = async (req, res) => {
     try {
         res.render('login');
     } catch (error) {
         console.log(error.message);
     }

 }

 const loadUserMatches = async (req, res) => {
     try {

         return res.render('testmatches', {
             user: req.session.user,
             currentRoute: 'matches'
         });
     } catch (error) {
         console.log(error.message);
         return res.status(500).send("Internal Server Error");
     }
 };
 const loadUserMatchesTest = async (req, res) => {
     try {

         return res.render('testmatches-pannel', {
             user: req.session.user,
             currentRoute: 'matches'
         });
     } catch (error) {
         console.log(error.message);
         return res.status(500).send("Internal Server Error");
     }
 };

 const homepage = async (req, res) => {
     try {
            return res.render('dateapp-sidebar', {
                currentRoute: 'homepage'
         });
     } catch (error) {
         console.log(error.message);
         return res.status(500).send("Internal Server Error");
     }
 };

 const login = async (req, res) => {
     try {
         const {
             email,
             password
         } = req.body;

         const userData = await User.findOne({
             email
         });

         if (userData) {
             const passwordMatch = await bcrypt.compare(password, userData.password);

             if (passwordMatch) {
                 req.session.user = userData;
                 return Response.success(res, "Login successful", {
                     // redirect: '/dashboard'
                         redirect: '/loadMatchesTem'

                 });
             } else {
                 return Response.unauthorized(res, "Invalid email or password");
             }
         } else {
             return Response.unauthorized(res, "Invalid email or password");
         }
     } catch (error) {
         console.error(error.message);
         return Response.error(res, "Internal Server Error");
     }
 };


 const logout = async (req, res) => {
     try {
         req.session.destroy();
         res.redirect('/');
     } catch (error) {
         console.log(error.message);
     }

 }

 const loadDashboard = async (req, res) => {
     if (!req.session.user) {
         return false;
     }
     try {
        //  var groupCode = await Group.findOne({
        //      _id: req.session.user.group_id
        //  }).select('name');
        //  if (!groupCode) {
        //      console.log("Group not found!");
        //      return res.status(404).send("Group not found");
        //  }
         var users = await User.find({
             group_id: req.session.user.group_id,
             _id: {
                 $ne: req.session.user._id
             }
         });
         res.render('dashboard', {
             user: req.session.user,
             users: users,
             // groupCode: groupCode,
             currentRoute: 'dashboard'
         });
     } catch (error) {
         console.log(error.message);
     }

 }

 const getCustomers = async (req, res) => {
     console.log("customer id", req.body.emp_id);
     try {
         var users = await User.find({
             _id: req.body.emp_id
         });
         console.log("users list", users);
         res.status(200).send({
             success: true,
             msg: "Customer Goted !!",
             users: users
         })
         //res.render('dashboard',{user:req.session.user, users:users});

     } catch (error) {
         console.log(error.message);
     }

 }

 const getReceiverRecord = (req, res) => {
     console.log("test code 12", req.body.receiver_id);
 }
 const saveChat = async (req, res) => {
     try {
         var chat = new Chat({
             sender_id: req.body.sender_id,
             receiver_id: req.body.receiver_id,
             message: req.body.message,
         });

         var newChat = await chat.save();
         res.status(200).send({
             success: true,
             msg: "Chat Inserted !!",
             data: newChat
         })
     } catch (error) {
         res.status(400).send({
             success: false,
             msg: error.message
         });
     }
 }

 const deleteChat = async (req, res) => {
     try {
         await Chat.deleteOne({
             _id: req.body.id
         });
         res.status(200).send({
             success: true
         });
     } catch (error) {
         res.status(400).send({
             success: false,
             msg: error.message
         });
     }
 }

 //code for manage group code
 const createGroup = async (req, res) => {
     try {
         res.render('group');
     } catch (error) {
         console.log(error.message);
     }

 }
 const saveGroup = async (req, res) => {
     try {
         const existingGroup = await Group.findOne({
             name: req.body.name
         });
         if (existingGroup) {
             return res.status(400).send({
                 success: false,
                 msg: "Group name already exists!"
             });
         }
         var group = new Group({
             name: req.body.name,
             userid: req.session.user._id // Store the authenticated user ID
         });
         var newGroup = await group.save();
         res.status(200).send({
             success: true,
             msg: "Group Created!",
             data: newGroup
         });
     } catch (error) {
         res.status(400).send({
             success: false,
             msg: error.message
         });
     }
 };

 // const loadmMatches = async (req, res) => {
 //     try {
 //       const currentUser = await User.findById(req.session.user._id);

 //       if (!currentUser) {
 //         return res.status(404).json({ error: 'User not found' });
 //       }

 //       const userLat = parseFloat(currentUser.latitude);
 //       const userLng = parseFloat(currentUser.longitude);
 //       const radiusKm = 25;

 //       // Fetch all users except the logged-in one
 //       //const  allUsers = await User.find({ _id: { $ne: currentUser._id } });
 //       const allUsers = await User.find({ _id: { $ne: currentUser._id } });
 //       // Calculate distance manually
 //       const nearbyUsers = allUsers.filter(user => {
 //         const lat = parseFloat(user.latitude);
 //         const lng = parseFloat(user.longitude);
 //         const distance = getDistanceFromLatLonInKm(userLat, userLng, lat, lng);
 //         //console.log('userLat',userLat,'userLng',userLng,'lat',lat,'lng',lng);
 //         //console.log('distance',distance);
 //         return distance <= radiusKm;
 //       });

 //        const nearbyUsers2 = (
 //         await Promise.all(
 //           nearbyUsers.map(async user => {
 //             const likeCount = await likeModel.countDocuments({ user_id: user._id });
 //             //console.log('likeCount ',likeCount, 'User ID',user._id);
 //             const checkLiked = await likeModel.exists({
 //               user_id: user._id,
 //               liker_id: currentUser._id
 //             });
 //             return  { ...user.toObject(), likeCount,checkLiked: !!checkLiked };
 //           })
 //         )
 //       ).filter(user => user !== null);

 //       console.log('nearbyUsers2',nearbyUsers2);
 //       res.render('matches',{user:req.session.user, users:nearbyUsers2,currentRoute: 'matches'});


 //     } catch (error) {
 //       console.error(error.message);
 //       return res.status(500).json({ error: 'Internal Server Error' });
 //     }
 //   };

 const loadmMatches = async (req, res) => {
     try {
         const currentUser = await User.findById(req.session.user._id);

         if (!currentUser) {
             return res.status(404).json({
                 statusCode: 404,
                 message: 'User not found'
             });
         }

         const userLat = parseFloat(currentUser.latitude);
         const userLng = parseFloat(currentUser.longitude);
         const radiusKm = 25;

         const allUsers = await User.find({
             _id: {
                 $ne: currentUser._id
             }
         });

         const nearbyUsers = allUsers.filter(user => {
             const lat = parseFloat(user.latitude);
             const lng = parseFloat(user.longitude);
             const distance = getDistanceFromLatLonInKm(userLat, userLng, lat, lng);
             return distance <= radiusKm;
         });

         const nearbyUsers2 = (
             await Promise.all(
                 nearbyUsers.map(async user => {
                     const likeCount = await likeModel.countDocuments({
                         user_id: user._id
                     });
                     const checkLiked = await likeModel.exists({
                         user_id: user._id,
                         liker_id: currentUser._id
                     });
                     return {
                         ...user.toObject(),
                         likeCount,
                         checkLiked: !!checkLiked
                     };
                 })
             )
         ).filter(user => user !== null);

         // Render partial HTML using EJS
         res.render('partials/userList', {
             users: nearbyUsers2
         }, (err, html) => {
             if (err) {
                 console.error(err.message);
                 return res.status(500).json({
                     statusCode: 500,
                     message: 'Render failed'
                 });
             }
             return res.status(200).json({
                 statusCode: 200,
                 html: html
             });
         });

     } catch (error) {
         console.error(error.message);
         return res.status(500).json({
             statusCode: 500,
             message: 'Internal Server Error'
         });
     }
 };


 // Haversine formula to calculate distance between two coordinates
 function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
     const R = 6371; // Radius of earth in km
     const dLat = deg2rad(lat2 - lat1);
     const dLon = deg2rad(lon2 - lon1);
     const a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(deg2rad(lat1)) *
         Math.cos(deg2rad(lat2)) *
         Math.sin(dLon / 2) *
         Math.sin(dLon / 2);

     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     const d = R * c; // Distance in km
     return d;
 }

 function deg2rad(deg) {
     return deg * (Math.PI / 180);
 }

 const userAddNewLike = async (req, res) => {
     try {
         const userLike = new likeModel({
             user_id: req.body.userId,
             liker_id: req.body.likerId,
         });

         //code for check user already like
         const userId = req.body.userId;
         const likerId = req.body.likerId;
         const existingLike = await likeModel.findOne({
             user_id: userId,
             liker_id: likerId
         });

         const likedUser = await User.findById(userId);
         const likerUser = await User.findById(likerId);

         if (!likedUser || !likerUser) {
             return res.status(404).json({
                 success: false,
                 message: "User not found.",
                 statusCode: 404
             });
         }

         if (existingLike) {
             await likeModel.deleteOne({
                 _id: existingLike._id
             });
             //  Send notification for un-like
             //  Send real-time "unlike" notification
             req.app.get('io').of('/user-namespace').to(userId).emit('likeNotification', {
                 type: 'unlike',
                 from: likerId,
                 message: 'You loss a like!'
             });
             // await Notification.create({
             //   user_id: userId,
             //   sender_id: likerId,
             //   title: 'Profile Unliked',
             //   message: `${likerUser.name} removed their like.`,
             //   type: 'unlike',
             // });

             return res.status(200).json({
                 statusCode: 400,
                 message: "Like removed successfully."
             });
         }
         //end code for check user already like
         const savedLike = await userLike.save();
         req.app.get('io').of('/user-namespace').to(userId).emit('likeNotification', {
             type: 'like',
             from: likerId,
             message: 'You got a like!'
         });
         //send notification for like
         await Notification.create({
             user_id: userId,
             sender_id: likerId,
             title: 'New Like',
             message: `${likerUser.name} liked your profile.`,
             type: 'like',
         });
         return res.status(201).json({
             success: true,
             statusCode: 200,
             message: 'You have successfully liked the profile!',
             data: savedLike
         });
     } catch (error) {
         console.error('Error saving like/unlike:', error);
         return res.status(500).json({
             success: false,
             message: 'Failed to save like',
             error: error.message
         });
     }
 };

 const getNotifications = async (req,res) => {
    try{
        const userId = req.session.user._id;
        const userNotification = await Notification.find({ user_id: userId })
                               .populate('sender_id', 'image');
        const publicPath  = process.env.appUrl;
        if(userNotification){
            userNotification.map(n=>{
                if(n.sender_id && n.sender_id.image){
                    n.sender_id.image = `${publicPath}${n.sender_id.image}`;
                }
            });
        }
       return Response.success(res, "Notification received successful", {
                     redirect: '/notification',
                     userNotification:userNotification,
                 });
    }
    catch(Exception){
      console.log("notification error",Exception);
    }
 }

 //code for new template
 const loadMatchesTem = async (req, res) => {
     try {
         const currentUser = await User.findById(req.session.user._id);

         if (!currentUser) {
             return res.status(404).json({
                 statusCode: 404,
                 message: 'User not found'
             });
         }
        
        let distance = 0;
        const userId = req.session.user._id;
        const matchesUsersIds = await Matches
        .find({ user_id: userId })
        .select('matches_id -_id');
        const idsArr = matchesUsersIds.map(item => item.matches_id);

         const userLat = parseFloat(currentUser.latitude);
         const userLng = parseFloat(currentUser.longitude);
         const radiusKm = 25;
         
         const allUsers = await User.find({
             _id: {
                 $ne: currentUser._id,
                 $nin: idsArr
             }
         });

         const nearbyUsers = allUsers.filter(user => {
             const lat = parseFloat(user.latitude);
             const lng = parseFloat(user.longitude);
             distance = getDistanceFromLatLonInKm(userLat, userLng, lat, lng);
             return distance <= radiusKm;
         });

         const nearbyUsers2 = (
             await Promise.all(
                 nearbyUsers.map(async user => {
                     const likeCount = await likeModel.countDocuments({
                         user_id: user._id
                     });
                     const checkLiked = await likeModel.exists({
                         user_id: user._id,
                         liker_id: currentUser._id
                     });
                     return {
                         ...user.toObject(),
                         likeCount,
                         checkLiked: !!checkLiked
                     };
                 })
             )
         ).filter(user => user !== null);

         // Render partial HTML using EJS
         console.log('u record',nearbyUsers2);
         res.json({
            success: true,
            profiles: nearbyUsers2.map(u => ({
                id: u._id,
                name: u.name || '',
                age: u.age || null,           // if you have DOB then I can auto-calculate
                dist: u.distance ? u.distance + ' km' : '0 km',
                bio: u.bio || '',
                photo: `http://127.0.0.1:3000/${u.image}`,
                likeCount: u.likeCount || 0,
                checkLiked: u.checkLiked || false,
                is_online: u.is_online,
                dist:distance ? 'Near '+ parseInt(distance) + ' km' : '0 km',
            }))
        });

        //  res.render('matchesRecord', {
        //      currentRoute: '/loadMatchesTem',
        //      users: nearbyUsers2
        //  });
         

     } catch (error) {
         console.error(error.message);
         return res.status(500).json({
             statusCode: 500,
             message: error.message || 'Internal Server Error'
         });
     }
 };

 const goToMatches= async (req, res) => {
     try {

         return res.render('matchesRecord', {
             user: req.session.user,
             currentRoute: 'loadMatchesTem'
         });
     } catch (error) {
         console.log(error.message);
         return res.status(500).send("Internal Server Error");
     }
 };
 //end code for new template

 //end code for manage group code
 module.exports = {
     registerLoad,
     register,
     loadLogin,
     login,
     logout,
     loadDashboard,
     saveChat,
     getReceiverRecord,
     deleteChat,
     getCustomers,
     iframe,
     createGroup,
     saveGroup,
     loadmMatches,
     userAddNewLike,
     loadUserMatches,
     loadUserMatchesTest,
     getNotifications,
     notification,
     homepage,
     loadMatchesTem,
     goToMatches,
 }