const isLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // AJAX request – respond with JSON
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      // Normal browser request – redirect
      return res.redirect('/');
    }
  }
};

const isLogout = async(req,res,next)=>
    {
        try{
            if(req.session.user)
            {
                res.redirect('/dashboard');
            }
            next();
        }
        catch (error)
        {
            console.log(error.message);
        }
    }

module.exports = {
    isLogin,
    isLogout
}