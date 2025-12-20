const express = require('express');
const user_route = express();
const bodyParser = require('body-parser');

const session = require('express-session');
const { SESSION_SECRET } = process.env;
user_route.use(session({secret:SESSION_SECRET}));


user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded( {extended:true} )); 

const docusign = require("docusign-esign");

user_route.set('view engine','ejs');
user_route.set('views','./views');

//user_route.use(express.static('public'));

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req, file, cb)
    {
        cb(null, path.join(__dirname,'../public/images/'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const userController = require('../controllers/userController');
const matchesController = require('../controllers/matchesController');


const auth = require('../middlewares/auth')

const upload = multer({storage:storage});
user_route.get('/register', auth.isLogout , userController.registerLoad);
user_route.post('/register',upload.single('image'), userController.register);

user_route.get('/create-group', userController.createGroup);
user_route.post('/save-group', userController.saveGroup);

user_route.get('/', auth.isLogout, userController.loadLogin);
user_route.post('/',userController.login);
user_route.get('/logout',auth.isLogin, userController.logout);
user_route.get('/dashboard',auth.isLogin, userController.loadDashboard);
user_route.get('/loadMatches',auth.isLogin, userController.loadUserMatches);
user_route.get('/loadMatches-test',auth.isLogin, userController.loadUserMatchesTest);

//route for new template
user_route.get('/homepage',auth.isLogin, userController.homepage);
user_route.get('/loadMatchesTem',auth.isLogin, userController.goToMatches);
user_route.post('/loadMatchesTem',auth.isLogin, userController.loadMatchesTem);
user_route.post('/likeRecord',auth.isLogin, matchesController.liked);
user_route.get('/getRecentMatchesList',auth.isLogin, matchesController.getRecentMatchesList);
user_route.get('/resetAllMatches',auth.isLogin, matchesController.resetAllMatches);
user_route.get('/getUserSpecInfo',auth.isLogin, matchesController.getUserSpecInfo);


//end route for new template

user_route.get('/matches',auth.isLogin, userController.loadmMatches);
user_route.post('/user-liked',auth.isLogin, userController.userAddNewLike);
user_route.get('/notification',auth.isLogin, userController.notification);
user_route.post('/notifications',auth.isLogin, userController.getNotifications);

user_route.get('/iframe', userController.iframe);

user_route.post('/save-chat', userController.saveChat);
user_route.post('/delete-chat', userController.deleteChat);


user_route.post('/get-customers', userController.getCustomers);

user_route.get('/get-receiver-record', userController.getReceiverRecord);

// user_route.get('*', function(req,res){
//     res.redirect('/');
// });
module.exports = user_route;


